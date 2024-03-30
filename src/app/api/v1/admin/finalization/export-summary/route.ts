import {NextRequest, NextResponse} from "next/server";
import {getServerAuthSession} from "@/lib/nextauthOptions";
import {getTypeRangeTime} from "@/ultis/timeFormat.ultis";
import {dataTemplate} from "@/helpers/returned_response_template";
import clientPromise from "@/lib/mongodb";

export async function GET(req: NextRequest) {
    const session = await getServerAuthSession();
    if (!session) {
        return NextResponse.redirect("/")
    }
    const type = req.nextUrl.searchParams.get("type");
    if (!type) {
        return dataTemplate({error: "Type is required"}, 400);
    }
    const timeRange = getTypeRangeTime(type as 'morning' | 'afternoon' | 'evening');

    const client = await clientPromise;

    const orderCollection = client.db(process.env.DB_NAME).collection("food-orders");

    const filterOrders = await  orderCollection.find({
        createdAt: {
            $gte: timeRange.startTime,
            $lte: timeRange.endTime
        },
    }).toArray();

    if (!filterOrders) {
        return dataTemplate({error: "Failed to get orders"}, 500);
    }

    return dataTemplate({data: filterOrders}, 200);
}