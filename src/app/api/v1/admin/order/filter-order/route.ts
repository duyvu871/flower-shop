import { NextRequest } from 'next/server';
import { getServerAuthSession } from '@/lib/nextauthOptions';
import { dataTemplate } from '@/helpers/returned_response_template';
import { ExportService } from '@/services/export-excel';
import clientPromise from '@/lib/mongodb';

import { formatISODate, getEndTime, startTime } from '@/ultis/timeFormat.ultis';
import { OrderType } from 'types/order';
import * as process from 'process';
import { Collection, ObjectId } from 'mongodb';
import DBConfigs from '@/configs/database.config';

export async function GET(req: NextRequest) {
	const session = getServerAuthSession();
	if (!session) {
		return dataTemplate({ error: 'Unauthorized' }, 401);
	}
	const data = await session;
	if (data.user.role !== 'admin') {
		return dataTemplate({ error: 'Unauthorized' }, 401);
	}
	const range =
		(req.nextUrl.searchParams.get('range') as
			| 'day'
			| 'week'
			| 'month'
			| 'year'
			| 'all'
			| 'morning'
			| 'afternoon'
			| 'evening'
			| 'other') || 'all';
	const page = req.nextUrl.searchParams.get('page') as string;
	const limit = req.nextUrl.searchParams.get('limit') || String(DBConfigs.perPage);
	const filterKey = req.nextUrl.searchParams.get('filterKey')
		? (req.nextUrl.searchParams.get('filterKey') as string)
		: 'createdAt';
	const filterOrder = req.nextUrl.searchParams.get('filterOrder')
		? (req.nextUrl.searchParams.get('filterOrder') as string)
		: 'desc';

	// console.log(range);
	const start = req.nextUrl.searchParams.get('start');
	const end = req.nextUrl.searchParams.get('end');
	const timeStart = start ? new Date(start) : new Date();
	const endTime = end ? new Date(end) : new Date();

	const client = await clientPromise;
	const orderCollection = client.db(process.env.DB_NAME).collection('food-orders');
	// let foodDeliveryCollection = client.db(process.env.DB_NAME).collection(`${range}-menu`);
	const menuCollections: Record<string, Collection<Document>> = [
		'morning',
		'afternoon',
		'evening',
		'other',
	].reduce(
		(acc, curr) => ({ ...acc, [curr]: client.db(process.env.DB_NAME).collection(`${curr}-menu`) }),
		{},
	);
	const filterOrders = orderCollection.find({
		createdAt: {
			$gte: timeStart,
			$lte: endTime,
		},
	});
	const allOrders = (await filterOrders
		.sort({
			[filterKey]: filterOrder === 'asc' ? 1 : -1,
		})
		.skip((Number(page) - 1) * Number(limit))
		.limit(Number(limit))
		.toArray()) as OrderType[]; // get all orders
	const count = await orderCollection.countDocuments({
		createdAt: {
			$gte: timeStart,
			$lte: endTime,
		},
	}); // count all orders
	// console.log(allOrders.length);
	console.log('start:', timeStart);
	console.log('end:', endTime);
	const foods: Record<string, any> = {}; // store all food items
	const validRange =
		range === 'morning' || range === 'afternoon' || range === 'evening' || range === 'other';

	const orderResult: Promise<OrderType>[] = allOrders.map(async (order, index) => {
		const orderList = order.orderList as OrderType['orderList']; // get order list
		const foodsIds = orderList.filter(item => {
			if (range === 'all') return true;
			// check menuType because some old order does have it
			if (item?.menuType) return item.menuType.split('-')[0] === range;
			else return true;
		}); // filter order items by menuType

		// calculate volume of valid order items
		let totalVolume = 0;
		for (let i = 0; i < foodsIds.length; i++) {
			if (!validRange && range !== 'all') break;
			if (foods[foodsIds[i].menuItem.toString()]) {
				totalVolume += foodsIds[i].totalOrder * foods[foodsIds[i].menuItem.toString()].price * 1000; //
			} else {
				foods[foodsIds[i].menuItem.toString()] = await menuCollections[
					foodsIds[i].menuType.split('-')[0]
				].findOne({
					_id: new ObjectId(foodsIds[i].menuItem),
				}); // get food item
				// calculate volume of valid order items
				totalVolume += foodsIds[i].totalOrder * foods[foodsIds[i].menuItem.toString()].price * 1000;
			}
			// console.log(i);
		}

		return {
			...order,
			orderList: foodsIds,
			orderVolume: totalVolume,
			createdAt: order.createdAt,
		};
	});

	const exportData = await Promise.all(orderResult);

	return dataTemplate({ data: exportData.filter(item => item.orderVolume > 0), count }, 200);
}
