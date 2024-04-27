import { NextRequest } from 'next/server';
import { getServerAuthSession } from '@/lib/nextauthOptions';
import { dataTemplate } from '@/helpers/returned_response_template';
import { ExportService } from '@/services/export-excel';
import clientPromise from '@/lib/mongodb';

import {
	formatISODate,
	getEndTime,
	orderTimeRangeSummary,
	startTime,
	TimeRange,
} from '@/ultis/timeFormat.ultis';
import { MenuItemType, OrderType } from 'types/order';
import * as process from 'process';
import { Collection, ObjectId } from 'mongodb';
import { utils, write } from 'xlsx';
import { object } from 'prop-types';
import { cli } from 'yaml/dist/cli';
import { UserInterface } from 'types/userInterface';

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
	console.log(range);

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
	const userCollection = client.db(process.env.DB_NAME).collection('users');

	const allMenuCollectionItemPromise = Object.keys(menuCollections).map(async collection => {
		const data = (await menuCollections[collection]
			.find({})
			.toArray()) as unknown as MenuItemType[];
		return {
			type: collection,
			data,
		};
	});

	const unPromiseWrap = await Promise.all(allMenuCollectionItemPromise);
	const menuCollectionByTarget = unPromiseWrap.reduce(
		(acc, curr) => ({
			...acc,
			[curr.type]: curr.data,
		}),
		{},
	) as Record<string, MenuItemType[]>;

	const menuItemList = Object.values(menuCollectionByTarget)
		.map(items =>
			items
				.map(item => ({
					name: item.name,
					_id: item._id,
					type: item.type,
				}))
				.filter(item => {
					if (range === 'all') return true;
					else {
						if (item.type.includes('other')) return true;
						else return item.type.includes(range);
					}
				}),
		)
		.flat();

	const allOrders = (await orderCollection
		.find({
			createdAt: {
				$gte: timeStart,
				$lte: endTime,
			},
		})
		.toArray()) as OrderType[];

	const calculateTotalOrder: Record<string, number> = {};
	const userOrder: Record<string, OrderType[]> = {};
	const userData: Record<string, UserInterface> = {};
	// handle using promise
	await Promise.all(
		allOrders.map(async order => {
			const currentOrder = order;
			// store user order information
			if (!userOrder[order.userId.toString()]) userOrder[order.userId.toString()] = [];
			currentOrder.orderList.filter(item => {
				if (range === 'all') return true;
				else {
					if (item.menuType.includes('other')) return true;
					else return item.menuType.includes(range);
				}
			});
			userOrder[order.userId.toString()].push(currentOrder);
			// store user data
			if (!userData[order.userId.toString()])
				userData[order.userId.toString()] = (await userCollection.findOne({
					_id: new ObjectId(order.userId),
				})) as UserInterface;
			// calculate order quantity
			currentOrder.orderList.forEach(item => {
				const quantityOrderId = item.menuItem.toString() + item.menuType;
				const total = calculateTotalOrder[quantityOrderId];
				if (total > 0) calculateTotalOrder[quantityOrderId] += Number(item.totalOrder);
				else calculateTotalOrder[quantityOrderId] = Number(item.totalOrder);
			});
		}),
	);
	// console.log(calculateTotalOrder);
	// console.log(allOrders.length);
	console.log('start:', timeStart);
	console.log('end:', endTime);
	const foods: Record<string, any> = {};

	// const sheetHeaders = Object.keys(menuCollections);
	// const headerMergeItem = sheetHeaders.reduce((acc, curr) => {
	//
	// }, [])
	// const orderResult = allOrders.map((order, index) => {
	// 	const orderList = order.orderList;
	// 	const itemCounts = menuItemList.map(menuItem => {
	// 		const isOrdered = orderList.find(item => {
	// 			// console.log(menuItem._id, item.menuItem);
	// 			return menuItem._id.toString() === item.menuItem.toString();
	// 		});
	// 		if (isOrdered) return isOrdered.totalOrder;
	// 		return '';
	// 	});
	// 	return [order.location, ...itemCounts, order.takeNote];
	// });

	const userOrderFormated = Object.keys(userOrder).map(userId => {
		const storeOrder: Record<string, number> = {};
		let takeNote: string[] = [];
		const orders = userOrder[userId];
		orders.forEach(order => {
			takeNote.push(order.takeNote);
			order.orderList.forEach(item => {
				const quantityOrderId = item.menuItem.toString() + item.menuType;
				if (!storeOrder[quantityOrderId]) storeOrder[quantityOrderId] = 0;
				storeOrder[quantityOrderId] += Number(item.totalOrder);
			});
		});
		const itemCounts = menuItemList.map(item =>
			storeOrder[item._id.toString() + item.type] > 0
				? storeOrder[item._id.toString() + item.type]
				: '',
		);

		return [userData[userId].fullName, ...itemCounts, takeNote.join('\n')];
	});
	const sheetData = [
		[
			'Loại menu',
			...Object.keys(menuCollectionByTarget)
				.filter(item => {
					if (range === 'all') return true;
					else {
						if (item.includes('other')) return true;
						else return item.includes(range);
					}
				})
				.map(item =>
					new Array(menuCollectionByTarget[item].length).fill(orderTimeRangeSummary[item]),
				)
				.flat(),
			'Ghi chú',
		],
		['Món', ...menuItemList.map(item => item.name), ''],
		[
			'Tổng',
			...menuItemList.map(item => calculateTotalOrder[item._id.toString() + item.type] || ''),
			'',
		],
		...userOrderFormated,
	];
	const mergeCells = () => {
		let currentPivot = 1;
		return Object.keys(menuCollectionByTarget)
			.filter(item => {
				if (range === 'all') return true;
				else {
					if (item.includes('other')) return true;
					else return item.includes(range);
				}
			})
			.map(menuType => {
				const itemLength = menuCollectionByTarget[menuType].length;
				const mergeData = {
					s: {
						r: 0,
						c: currentPivot,
					},
					e: {
						r: 0,
						c: currentPivot + itemLength - 1,
					},
				};
				currentPivot += itemLength;
				return mergeData;
			});
	};
	// create new workbook
	const workbook = utils.book_new();
	// create new worksheet
	const worksheet = utils.aoa_to_sheet(sheetData);
	// merge menu type
	if (!worksheet['!merges']) worksheet['!merges'] = [];
	worksheet['!merges'] = mergeCells();

	// append sheet to workbook
	utils.book_append_sheet(workbook, worksheet, orderTimeRangeSummary[range]);
	const buffer = await write(workbook, {
		type: 'buffer',
		bookType: 'xlsx',
	});
	const headers = new Headers();
	headers.append('Content-Disposition', 'attachment; filename="thongtindonhang.xlsx"');
	headers.append('Content-Type', 'application/vnd.ms-excel');

	// await client.close();

	return new Response(buffer, {
		headers,
	});
}
