import {NextRequest, NextResponse} from "next/server";
import {SearchEngine} from "@/services/search_engine";
import {MenuItemType} from "types/order";

export async function GET(req: NextRequest) {
    const id = req.nextUrl.searchParams.get('id');
    if (!id) {
        return NextResponse.json({error: "ID is required"}, {status: 400});
    }

    const response = await SearchEngine.searchInManyCollection<MenuItemType>(
        ['morning', 'afternoon', 'evening', 'other'].map(item => item + "-menu"),
        '_id',
        id,
        ['name', 'price', 'image', 'description', 'total_sold', 'address', 'discount', "_id"]
    );
}