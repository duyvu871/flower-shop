import clientPromise from '@/lib/mongodb';
import { PurchaseOrderType } from 'types/order';
import { ObjectId } from 'mongodb';
// import { NextResponse } from 'next/server';
import { dataTemplate } from '@/helpers/returned_response_template';
import { NotificationForAdmin } from '@/services/notification_for_admin';

export async function createPurchaseOrder(
	amount: number,
	userId: string,
	isPaid: boolean = false,
	items: { id: string; quantity: number }[],
	type: 'balance' | 'virtualVolume' = 'balance',
) {
	const client = await clientPromise;
	const collection = client.db(process.env.DB_NAME).collection('purchase-orders');
	const userCollection = client.db(process.env.DB_NAME).collection('users');
	if (!collection) {
		return dataTemplate({ error: 'Hệ thống đang bận, vui lòng thử lại sau' }, 500);
	}
	const user = await userCollection.findOne({ _id: new ObjectId(userId) });
	if (!user) {
		return dataTemplate({ error: 'Không tìm thấy người dùng' }, 404);
	}
	const defaultData: PurchaseOrderType = {
		_id: new ObjectId(),
		amount,
		paymentMethod: 'bank',
		userName: user.fullName,
		userId,
		status: 'pending',
		isPaid: false,
		confirmed: true,
		items,
		type,
		createdAt: new Date(),
		updatedAt: new Date(),
	};
	const result = await collection.insertOne(defaultData);
	// console.log(result)
	if (!result.acknowledged) {
		return dataTemplate({ error: 'Lỗi khi tạo đơn nạp' }, 500);
	}

	const notification = new NotificationForAdmin();
	await notification.sendNotificationToAdmin(
		'create',
		new Date(),
		{
			title: 'đơn nạp mới',
			desc: `Người dùng ${user.fullName} vừa tạo đơn nạp mới với số tiền ${amount}`,
			content: `Người dùng ${user.fullName} vừa tạo đơn nạp mới với số tiền ${amount}`,
		},
		{
			userId: user._id.toString(),
			referrerId: defaultData._id.toString(),
		},
		'deposit',
	);
	return dataTemplate({ data: defaultData, message: 'Tạo đơn nạp thành công' }, 200);
}
