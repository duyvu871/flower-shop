import clientPromise from '@/lib/mongodb';
import * as process from 'process';
import { ObjectId } from 'mongodb';
type ActionType = 'create' | 'update' | 'delete';

export class NotificationForAdmin {
	private notificationCollection: any;
	private notifyCount: number;
	constructor() {}
	public async sendNotificationToAdmin(
		action: ActionType,
		time?: Date,
		info?: { title: string; desc?: string; content?: string },
		referrer?: {
			userId: string;
			referrerId: string;
		},
		category: 'user' | 'order' | 'product' | 'deposit' | 'withdraw' | 'admin' | 'other' = 'other',
	): Promise<void> {
		try {
			const client = await clientPromise;
			let timestamp: Date = new Date();
			if (!time) {
				timestamp = new Date();
			}

			const insertData = {
				action,
				time: time.toISOString(),
				info: {
					title: info?.title,
					desc: info?.desc,
					content: info?.content,
				},
				isRead: false,
				category,
				referrer,
				createdAt: timestamp,
				updatedAt: timestamp,
			};
			await client.db(process.env.DB_NAME).collection('notifications').insertOne(insertData);
		} catch (error) {
			throw new Error(error);
		}
	}
	public async getNotificationById(id: string) {
		try {
			const client = await clientPromise;
			return await client
				.db(process.env.DB_NAME)
				.collection('notifications')
				.findOne({ _id: new ObjectId(id) });
		} catch (error) {
			throw new Error(error);
		}
	}
	public async getNotificationsWithPaginate(page: number, limit: number) {
		try {
			const client = await clientPromise;
			return client
				.db(process.env.DB_NAME)
				.collection('notifications')
				.find()
				.skip((page - 1) * limit)
				.limit(limit)
				.toArray();
		} catch (error) {
			throw new Error(error);
		}
	}
}
