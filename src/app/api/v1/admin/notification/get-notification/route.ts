import { NextRequest } from 'next/server';
import { dataTemplate } from '@/helpers/returned_response_template';
import { timeOrder } from 'types/order';
import DBConfigs from '@/configs/database.config';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(req: NextRequest) {
	try {
		const searchParams = new URL(req.url).searchParams;
		const page = searchParams.get('page') as string;
		const limit = searchParams.get('limit') || String(DBConfigs.perPage);
		const filterKey = req.nextUrl.searchParams.get('filterKey')
			? (req.nextUrl.searchParams.get('filterKey') as string)
			: 'createdAt';
		const filterOrder = req.nextUrl.searchParams.get('filterOrder')
			? (req.nextUrl.searchParams.get('filterOrder') as string)
			: 'desc';
		const client = await clientPromise;
		const notificationCollection = client.db(process.env.DB_NAME).collection('notifications');
		const notifications = await notificationCollection
			.find({})
			.sort({
				[filterKey]: filterOrder === 'asc' ? 1 : -1,
			})
			.skip((Number(page) - 1) * Number(limit))
			.limit(Number(limit))
			.toArray();
		const totalNotificationOrders = notifications.reduce((acc: number, cur: any) => {
			if (cur.isRead === false) {
				return acc + 1;
			} else {
				return acc;
			}
		}, 0);

		if (!notifications) {
			return dataTemplate({ error: 'Không tìm thấy thông báo nào' }, 404);
		}

		return dataTemplate({ data: notifications, count: totalNotificationOrders }, 200);
	} catch (e: any) {
		return dataTemplate({ error: e.message }, 500);
	}
}
