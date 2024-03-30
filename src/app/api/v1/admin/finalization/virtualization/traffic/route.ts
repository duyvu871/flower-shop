import {getServerAuthSession} from "@/lib/nextauthOptions";
import {dataTemplate} from "@/helpers/returned_response_template";
import {startTime, getPreviousCycle} from "@/ultis/timeFormat.ultis";
import clientPromise from "@/lib/mongodb";
import {NextRequest} from "next/server";

export async function GET(req: NextRequest) {
    const session = getServerAuthSession();
    if (!session) {
        return dataTemplate({error: "Unauthorized"}, 401);
    }
    const data = await session;
    if (data.user.role !== "admin") {
        return dataTemplate({error: "Unauthorized"}, 401);
    }
    const range = req.nextUrl.searchParams.get("range") as ("day" | "week" | "month" | "year" | "all") || "all";
    const timeStart = startTime(range);
    const {startTime: previousTimeStart, endTime: previousTimeEnd} = getPreviousCycle(range);
    const client = await clientPromise;
    const userCollection = client.db(process.env.DB_NAME).collection("users");
    const orderCollection = client.db(process.env.DB_NAME).collection("food-orders");
    const menuCollection = ['morning', 'afternoon', 'evening', 'other'].map((time) => client.db(process.env.DB_NAME).collection(`${time}-menu`));
    const countUser = await userCollection.countDocuments();
    const countMenu = await Promise.all(menuCollection.map((menu) => menu.countDocuments()));

    const countOrder = await orderCollection.find({
        status: 'approved',
        createdAt: {
            $gte: timeStart
        }
    }).toArray();
    const countPreviousOrder = await orderCollection.find({
        status: 'approved',
        createdAt: {
            $gte: previousTimeStart,
            $lte: previousTimeEnd
        }
    }).toArray();
    console.log("count-orders", countOrder.length, countPreviousOrder.length);
    const totalOrderRate = (countOrder.length - countPreviousOrder.length) / countPreviousOrder.length*100;

    const thisSessionRevenue = countOrder.reduce((acc, order) => acc + order.orderVolume, 0);
    const previousSessionRevenue = countPreviousOrder.reduce((acc, order) => acc + order.orderVolume, 0);
    const revenueRate = (thisSessionRevenue - previousSessionRevenue) / previousSessionRevenue*100;

    return dataTemplate({
       data: {
           revenue: {
               value: countOrder.reduce((acc, order) => acc + order.orderVolume, 0),
               type: revenueRate > 0 ? 'increase' : 'decrease',
               rate: Number(revenueRate.toFixed(2))
           },
           user: {
               count: countUser,
           },
           menu: {
               count: countMenu.reduce((acc, count) => acc + count, 0)
           },
           order: {
               value: countOrder.length,
               type: totalOrderRate > 0 ? 'increase' : 'decrease',
               rate: Number(totalOrderRate.toFixed(2)),
           }
       }
    }, 200);

}