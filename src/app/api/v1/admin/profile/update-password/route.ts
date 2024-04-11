import { NextRequest, NextResponse } from 'next/server';
import { updatePassword } from '@/lib/update/update-password';
import { ObjectId } from 'mongodb';
import { getServerAuthSession } from '@/lib/nextauthOptions';
import { messageTemplate } from '@/helpers/returned_response_template';
import clientPromise from '@/lib/mongodb';
import bcrypt from 'bcrypt';

type UpdatePasswordPayload = {
	newPassword: string;
	oldPassword: string;
	confirmPassword: string;
};

export async function POST(req: NextRequest) {
	try {
		const session = await getServerAuthSession();
		if (!session && session.user.role !== 'admin') {
			return NextResponse.redirect('/');
		}
		const { user } = session;
		const { newPassword, confirmPassword, oldPassword } = (await req.json()) as UpdatePasswordPayload;

		// const updateAction = await updatePassword({newPassword, oldPassword}, user._id as unknown as ObjectId);

		const dbClient = await clientPromise;
		const adminCollection = dbClient.db(process.env.DB_NAME).collection('admin');
		const admin = await adminCollection.findOne({ _id: new ObjectId(user._id) });
		if (!user) {
			return messageTemplate('Không tìm thấy tài khoản admin nào', 404);
		}

		if (!bcrypt.compareSync(oldPassword, admin.password)) {
			return messageTemplate('Mật khẩu cũ không đúng', 400);
		}

		const updatePassword = await adminCollection.updateOne(
			{ _id: new ObjectId(user._id) },
			{
				$set: { password: bcrypt.hashSync(newPassword, 10) },
			},
		);

		if (!updatePassword) {
			return messageTemplate('Cập nhật mật khẩu thất bại', 500);
		}

		if (!updatePassword.matchedCount) {
			return messageTemplate('Không có tài khoản nào khớp với thông tin cập nhật', 500);
		}
		if (!updatePassword.modifiedCount) {
			return messageTemplate('Cập nhật mật khẩu thất bại', 500);
		}

		return messageTemplate('Cập nhật mật khẩu thành công', 200);
	} catch (e: any) {
		return messageTemplate(e.message, 500);
	}
}
