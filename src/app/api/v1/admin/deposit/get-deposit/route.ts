import { NextRequest } from 'next/server';
import { dataTemplate } from '@/helpers/returned_response_template';
import clientPromise from '@/lib/mongodb';
import { getKey, setKey } from '@/lib/redis-cache';
import { UserInterface } from 'types/userInterface';
import { ObjectId } from 'mongodb';

export async function GET(req: NextRequest) {
	try {
		const page = req.nextUrl.searchParams.get('page')
			? parseInt(req.nextUrl.searchParams.get('page') as string)
			: 0;
		const limit = req.nextUrl.searchParams.get('limit')
			? parseInt(req.nextUrl.searchParams.get('limit') as string)
			: 10;
		const filterKey = req.nextUrl.searchParams.get('filterKey')
			? (req.nextUrl.searchParams.get('filterKey') as string)
			: 'createdAt';
		const filterOrder = req.nextUrl.searchParams.get('filterOrder')
			? (req.nextUrl.searchParams.get('filterOrder') as string)
			: 'desc';
		const client = await clientPromise;
		const userCollection = client.db(process.env.DB_NAME).collection('users');
		const depositCollection = client.db(process.env.DB_NAME).collection('purchase-orders');
		const result = await depositCollection
			.find()
			.sort({
				[filterKey]: filterOrder === 'asc' ? 1 : -1,
			})
			.skip((page - 1) * limit)
			.limit(limit)
			.toArray();
		const count = await depositCollection.countDocuments();
		if (result.length === 0) {
			return dataTemplate({ error: 'Không tìm thấy đơn nạp tiền' }, 404);
		}
		const handleDeposits = await Promise.all(
			result.map(async deposit => {
				let userPayload = (await getKey(`user:${deposit.userId}`)) as string | null | any;
				if (!userPayload) {
					userPayload = await userCollection.findOne({ _id: new ObjectId(deposit.userId) });
					await setKey(`user:${deposit.userId}`, JSON.stringify(userPayload), 60 * 60);
				}
				const userParsed = JSON.parse(userPayload) as UserInterface;
				return {
					...deposit,
					userName: userParsed.fullName,
				};
			}),
		);

		return dataTemplate({ data: handleDeposits, count }, 200);
	} catch (e: any) {
		return dataTemplate({ error: e.message }, 500);
	}
}

export const dynamic = 'force-dynamic';
