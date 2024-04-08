import { NextRequest } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { dataTemplate } from '@/helpers/returned_response_template';
import { ObjectId } from 'mongodb';

export async function POST(request: NextRequest) {
	try {
		let depositValue = 0;
		const requestBody = await request.json();
		const { depositId, status } = requestBody;
		const client = await clientPromise;

		const depositCollection = client.db(process.env.DB_NAME).collection('purchase-orders');

		const deposit = await depositCollection.findOne({ _id: new ObjectId(depositId) });
		if (!deposit) return dataTemplate({ error: 'Không tìm thấy đơn hàng' }, 404);
		if (deposit.status === 'approved')
			return dataTemplate({ error: 'Đơn hàng đã được cập nhật trước đó' }, 400);
		if (status.isPaid && status.confirmed) depositValue = deposit.amount;

		const updateDeposit = await depositCollection.updateOne(
			{ _id: new ObjectId(depositId) },
			{
				$set: {
					isPaid: status.isPaid,
					confirmed: status.confirmed,
					updatedAt: new Date(),
					status: 'approved',
				},
			},
		);
		if (!updateDeposit.acknowledged) return dataTemplate({ message: 'Cập nhật thất bại' }, 500);

		const userCollection = client.db(process.env.DB_NAME).collection('users');
		const user = await userCollection.findOne({ _id: new ObjectId(deposit.userId) });
		if (!user) return dataTemplate({ error: 'Không tìm thấy người dùng' }, 404);

		let depositUpdateData =
			deposit.type === 'balance'
				? { balance: user.balance + depositValue }
				: depositValue - user.virtualVolume > 0
					? {
							virtualVolume: 0,
							balance: user.balance + depositValue - user.virtualVolume,
						}
					: { virtualVolume: user.virtualVolume - depositValue };

		console.log(depositUpdateData);
		const updateDepositUser = await userCollection.updateOne(
			{ _id: new ObjectId(deposit.userId) },
			{
				$set: {
					...depositUpdateData,
				},
			},
		);
		if (!updateDepositUser.acknowledged) return dataTemplate({ message: 'Cập nhật thất bại' }, 500);

		return dataTemplate({ message: 'Cập nhật thành công' }, 200);
	} catch (e) {
		return dataTemplate({ error: e.error }, 400);
	}
}
