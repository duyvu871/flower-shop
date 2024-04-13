import { NextRequest } from 'next/server';
import { dataTemplate } from '@/helpers/returned_response_template';
import clientPromise from '@/lib/mongodb';
import { UserInterface } from 'types/userInterface';
import { revalidatePath } from 'next/cache';
import { Document } from 'mongodb';

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
		const searchString = req.nextUrl.searchParams.get('search') || '';
		const regex = new RegExp(
			[
				'',
				searchString
					.split(' ')
					.map(item => `(?=.*${item})`)
					.join('|'),
				'',
			].join(''),
			'i',
		);

		const filters = !searchString
			? {}
			: {
					fullName: {
						$regex: '.*' + searchString + '.*',
					},
				};

		const projectList = [
			'_id',
			'avatar',
			'fullName',
			'email',
			'phone',
			'status',
			'role',
			'balance',
			'id_index',
			'uid',
			'virtualVolume',
			'isLoyalCustomer',
			'total_request_withdraw',
			'revenue',
			'orders',
			'address',
			'cart',
			'orderHistory',
			'transactions',
			'actionHistory',
			'withDrawHistory',
			'bankingInfo',
		];
		// console.log(searchString)
		const client = await clientPromise;
		const users = client.db(process.env.DB_NAME).collection('users');

		let result: Document[];
		let countDocuments: number;
		if (filterKey === 'balance') {
			const pipeline = [
				{
					$addFields: {
						sortField: {
							$cond: {
								if: { $eq: ['$balance', 0] }, // if balance = 0
								then: '$virtualVolume', // then use virtualVolume
								else: '$balance', // else use balance
							},
						},
					},
				},
				{
					$sort: {
						balance: filterOrder === 'asc' ? 1 : -1,
						virtualVolume: filterOrder === 'asc' ? -1 : 1,
					},
				},
				{
					$project: {
						...projectList.reduce((acc, cur) => {
							acc[cur] = 1;
							return acc;
						}, {}),
					},
				},
			];
			const searchResult = users.aggregate(pipeline);

			result = await searchResult
				.skip((page - 1) * limit)
				.limit(limit)
				.toArray();
			// console.log(pipeline);
			const count = await searchResult.toArray();
			countDocuments = count.length;
			// console.log('countDocuments', count);
		} else {
			const searchResult = users.find(filters).sort({
				[filterKey]: filterOrder === 'asc' ? 1 : -1,
			});
			countDocuments = await searchResult.count();
			result = await searchResult
				.project(projectList)
				.skip((page - 1) * limit)
				.limit(limit)
				.toArray();
		}
		// console.log('countDocuments', countDocuments);
		const count = countDocuments || (await users.countDocuments());
		if (result.length === 0) {
			return dataTemplate({ error: 'Không tìm thấy người dùng' }, 404);
		}
		revalidatePath('/admin/dashboard');
		return dataTemplate({ data: result as UserInterface[], count }, 200);
	} catch (e) {
		console.log(e);
		return dataTemplate({ error: e.error }, 400);
	}
}

export const dynamic = 'force-dynamic';
