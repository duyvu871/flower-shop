import {getServerAuthSession} from "@/lib/nextauthOptions";
import {NextRequest, NextResponse} from "next/server";
import {getDocumentByIds, getHistory} from "@/lib/order";

export async function GET(req: NextRequest) {
    const session = await getServerAuthSession();
    if (!session) {
        return NextResponse.redirect("/")
    }
    const {user} = session;
    const id = req.nextUrl.searchParams.get("id");
    if (!id) {
        return NextResponse.json({error: "id is required"}, {status: 400});
    }
    const history = await getHistory("food-orders", id, 1, 10);
    if (!history) {
        return NextResponse.json({error: "Failed to get history"}, {status: 500});
    }
    // const collections = ['morning', 'afternoon', 'evening', 'other'].map(item => item + "-menu");

    // const {data} = history;
    // for (const item of data) {
    //     for (const order of item.orderList) {
    //         const result = await Promise.all(collections.map(collection => getDocumentByIds(collection, [order.menuItem], ["name"])));
    //         const orderData = result.find(item => item.length > 0);
    //         order.itemData = orderData[0];
    //     }
    // }

    return NextResponse.json(history, {status: 200});
}

export const dynamic = "force-dynamic";