import {NextRequest, NextResponse} from "next/server";
import {SearchEngine} from "@/services/search_engine";
import {MenuItemType} from "types/order";

export async function GET(req: NextRequest) {
    const id = req.nextUrl.searchParams.get('id');
    if (!id) {
        return NextResponse.json({error: "ID is required"}, {status: 400});
    }

    const response = await SearchEngine.searchByField<MenuItemType>(
        ['other'].map(item => item + "-menu").join(''),
        '_id',
        id,
        ['name', 'price', 'image', 'description', 'total_sold', 'address', 'discount', "_id"]
    );
    if (!response) {
        return NextResponse.json({error: "Failed to get menu data"}, {status: 500});
    }
    return NextResponse.json(response, {status: 200});
}