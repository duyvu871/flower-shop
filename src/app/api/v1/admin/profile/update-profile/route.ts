import { NextRequest, NextResponse } from 'next/server';
import { dataTemplate } from '@/helpers/returned_response_template';
import { getServerAuthSession } from '@/lib/nextauthOptions';
import { UserInterface } from 'types/userInterface';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { setKey } from '@/lib/redis-cache';

export async function POST(request: NextRequest) {
	try {
		const session = await getServerAuthSession();
		if (!session && session.user.role !== 'admin') {
			return NextResponse.redirect('/');
		}
		const { user } = session;
		const client = await clientPromise;
		const adminCollection = client.db(process.env.DB_NAME).collection('admins');
		const userUpdate = await request.json();
		if (userUpdate.password) {
			delete userUpdate.password;
		}
		const updateUser = await adminCollection.updateOne(
			{
				_id: new ObjectId(user._id),
			},
			{
				$set: {
					...userUpdate,
				},
			},
		);
		if (!updateUser.matchedCount) {
			return dataTemplate({ error: 'Không tìm thấy thông báo nào' }, 404);
		}

		return dataTemplate({ data: updateUser }, 200);
	} catch (e: any) {
		return dataTemplate({ error: e.message }, 500);
	}
}
