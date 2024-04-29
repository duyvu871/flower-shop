import { ObjectId } from 'mongodb';
import { UserInterface } from 'types/userInterface';
import clientPromise from '@/lib/mongodb';
import bcrypt from 'bcrypt';
import { setKey } from '@/lib/redis-cache';

export async function UpdateFullUser(userUpdate: Partial<UserInterface>, _id: ObjectId) {
	const dbClient = await clientPromise;
	const userCollection = dbClient.db(process.env.DB_NAME).collection('users');
	const user = await userCollection.findOne({ _id: new ObjectId(_id) });
	if (!user) {
		throw new Error('User not found');
	}
	const updateData = {
		...userUpdate,
	};
	if (userUpdate.password) {
		updateData.password = bcrypt.hashSync(userUpdate.password, 10);
	}
	const updateUser = await userCollection.updateOne(
		{ _id: new ObjectId(_id) },
		{
			$set: {
				...updateData,
				updatedAt: new Date(),
			},
		},
	);
	if (!updateUser) {
		throw new Error('Update user failed');
	}
	await setKey(
		`user-${_id}`,
		JSON.stringify({
			...user,
			...updateData,
		} as UserInterface),
		60 * 60 * 24,
	);
	return updateUser;
}
