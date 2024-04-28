import { NextResponse, NextRequest } from 'next/server';
import { ObjectId } from 'mongodb';
import { getMenuList } from '@/lib/order';
import { useSearchParams } from 'next/navigation';
import { timeOrder } from 'types/order';
import DBConfigs from '@/configs/database.config';

export async function GET(req: NextRequest) {
	const searchParams = new URL(req.url).searchParams;
	const time = searchParams.get('time') as timeOrder;
	const page = searchParams.get('page') as string;
	const limit = searchParams.get('limit') || String(DBConfigs.perPage);
	const filterKey = req.nextUrl.searchParams.get('filterKey')
		? (req.nextUrl.searchParams.get('filterKey') as string)
		: 'price';
	const filterOrder = req.nextUrl.searchParams.get('filterOrder')
		? (req.nextUrl.searchParams.get('filterOrder') as string)
		: 'desc';
	const search = req.nextUrl.searchParams.get('search') || '';
	// console.log(time);
	const menuListWithPaginate = await getMenuList(
		time,
		Number(page),
		Number(limit),
		'user',
		{ filterKey, filterOrder },
		search,
	);

	if (!menuListWithPaginate.data) {
		return NextResponse.json({ error: 'Xảy ra lỗi gì đó ở menu session' }, { status: 404 });
	}

	return NextResponse.json(menuListWithPaginate, { status: 200 });
}
export const dynamic = 'force-dynamic';
