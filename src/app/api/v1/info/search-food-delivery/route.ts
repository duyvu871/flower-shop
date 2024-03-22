import {NextRequest, NextResponse} from "next/server";
import {SearchEngine} from "@/services/search_engine";
import {MenuItemType} from "types/order";
import {aws4} from "mongodb/src/deps";

export async function GET(req: NextRequest, params: {search :string}) {
    const search = req.nextUrl.searchParams.get('search');
    if (!search) {
        return NextResponse.json({error: "Search query is required"}, {status: 400});
    }
    const result = await SearchEngine.searchInManyCollection<MenuItemType>(
        ['morning', 'afternoon', 'evening', 'other'].map(item => item + "-menu"),
        'name',
        search,
        ['name', 'price', 'image', 'description', 'total_sold', 'address', 'discount', "_id", "type"]
        );

    return NextResponse.json(result, {status: 200});
}
