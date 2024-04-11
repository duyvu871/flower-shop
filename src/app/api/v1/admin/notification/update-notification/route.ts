import { NextRequest } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { dataTemplate } from '@/helpers/returned_response_template';
import { ObjectId } from 'mongodb';

export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		const { isRead, id } = body;
		const client = await clientPromise;
		const notificationCollection = client.db(process.env.DB_NAME).collection('notifications');
		const updateNotification = await notificationCollection.updateOne(
			{
				_id: new ObjectId(id),
			},
			{
				$set: {
					isRead,
				},
			},
		);
		if (!updateNotification.matchedCount) {
			return dataTemplate({ error: 'Không tìm thấy thông báo nào' }, 404);
		}
		return dataTemplate({ data: [] }, 200);
	} catch (e: any) {
		return dataTemplate({ error: e.message }, 500);
	}
}
