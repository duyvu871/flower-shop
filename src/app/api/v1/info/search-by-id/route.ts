import {NextRequest, NextResponse} from "next/server";
import {SearchEngine} from "@/services/search_engine";
import {MenuItemType} from "types/order";

export async function GET(req: NextRequest) {
    const ids = req.nextUrl.searchParams.get('ids').split(',');
    if (!ids) {
        return NextResponse.json({error: "ID is required"}, {status: 400});
    }
    const collections = ['morning', 'afternoon', 'evening', 'other'].map(item => item + "-menu");
    let response = [];
    for (const id of ids) {
           for (const collection of collections) {
                  const result = await SearchEngine.searchByField<MenuItemType>(collection, "_id", id, ['name', 'price', 'image', 'description', 'total_sold', 'address', 'discount', "_id", "type"]);
                  if (result.length > 0) {
                    response.push(result[0]);
                    break;
                  }
           }
    }
    if (!response) {
        return NextResponse.json({error: "Failed to get menu data"}, {status: 500});
    }
    return NextResponse.json(response, {status: 200});
}