import { NextRequest } from 'next/server';
import { getServerAuthSession } from '@/lib/nextauthOptions';
import { dataTemplate } from '@/helpers/returned_response_template';
import { ExportService } from '@/services/export-excel';
import clientPromise from '@/lib/mongodb';

import { formatISODate, getEndTime, startTime } from '@/ultis/timeFormat.ultis';
import { OrderType } from 'types/order';
import * as process from 'process';
import { ObjectId } from 'mongodb';

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
			| 'evening') || 'all';
	console.log(range);
	const timeStart = startTime(range);
	const endTime = getEndTime(range as 'morning' | 'afternoon' | 'evening');
	const client = await clientPromise;
	const orderCollection = client.db(process.env.DB_NAME).collection('food-orders');
	let foodDeliveryCollection = client.db(process.env.DB_NAME).collection(`${range}-menu`);
	const allOrders = await orderCollection
		.find({
			createdAt: {
				$gte: timeStart,
				$lte: endTime,
			},
		})
		.toArray();
	// console.log(allOrders.length);
	console.log('start:', timeStart);
	console.log('end:', endTime);
	const foods: Record<string, any> = {};
	const orderResult = allOrders.map(async (order, index) => {
		const orderList = order.orderList as OrderType['orderList'];
		const foodsIds = orderList
			.filter(item => {
				return item.menuType.split('-')[0] === range;
			})
			.map(item => ({
				menuItem: item.menuItem,
				totalOrder: item.totalOrder,
			}));
		const validRange = range === 'morning' || range === 'afternoon' || range === 'evening';
		// calculate volume of valid order items
		let totalVolume = 0;
		for (let i = 0; i < foodsIds.length; i++) {
			if (!validRange) break;
			if (foods[foodsIds[i].menuItem.toString()]) {
				totalVolume += foodsIds[i].totalOrder * foods[foodsIds[i].menuItem.toString()].price * 1000; //
			} else {
				foods[foodsIds[i].menuItem.toString()] = await foodDeliveryCollection.findOne({
					_id: new ObjectId(foodsIds[i].menuItem),
				});
				totalVolume += foodsIds[i].totalOrder * foods[foodsIds[i].menuItem.toString()].price * 1000;
			}
			// console.log(i);
		}
		// console.log('totalVolume', foods);
		return {
			// STT: index + 1,
			'Mã người dùng': String(order.userId),
			'Số đơn': order.orderList.reduce((acc: any, cur: { menuType: string; totalOrder: any }) => {
				if (validRange) {
					return cur.menuType.split('-')[0] === range ? acc + cur.totalOrder : acc;
				} else {
					return acc + cur.totalOrder;
				}
			}, 0),
			'Danh sách món': order.orderList
				.map(item => {
					if (validRange) {
						return item.menuType.split('-')[0] === range
							? item.name + ' x' + item.totalOrder + ' \n'
							: '';
					} else {
						return item.name + ' x' + item.totalOrder + ' \n';
					}
				})
				.join(''),
			'Tổng tiền': validRange ? totalVolume : order.orderVolume,
			'Ghi chú': order.note || '',
			'Địa chỉ': order.location || '',
			'Trạng thái': order.status === 'approved' ? 'Đã duyệt' : 'Chưa duyệt',
			'Thời gian tạo': formatISODate(order.createdAt),
			'Thời gian cập nhật': formatISODate(order.updatedAt),
		};
	});
	// console.log(allOrders);
	// allOrders.forEach(item => {
	// 	if (item.createdAt > new Date('2024-03-31T16:28:45.392Z')) console.log(item.createdAt);
	// });
	const exportData = await Promise.all(orderResult);
	const exportService = new ExportService();
	const buffer = await exportService.exportDataForVisualization(
		exportData
			.filter(item => item['Số đơn'] !== 0)
			.map((item, index) => ({ STT: index + 1, ...item })),
		'donhang',
	);
	const headers = new Headers();
	headers.append(
		'Content-Disposition',
		'attachment; filename="thongtindonhang-' + range + '.xlsx"',
	);
	headers.append('Content-Type', 'application/vnd.ms-excel');

	return new Response(buffer, {
		headers,
		// status: 200,
	});
}
