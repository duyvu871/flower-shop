import {ObjectId} from "mongodb";
import {NextRequest} from "next/server";
import {dataTemplate} from "@/helpers/returned_response_template";
// import {timeOrder} from "types/order";
import DBConfigs from "@/configs/database.config";
import clientPromise from "@/lib/mongodb";

export async function GET(req: NextRequest) {
    try {
        const searchParams = new URL(req.url).searchParams;
        const id = searchParams.get("id") as string;

        const client = await clientPromise;
        const foodOrderCollection = client.db(process.env.DB_NAME).collection("food-orders");
        const foodOrders = await foodOrderCollection.findOne({_id: new ObjectId(id)})

        if (!foodOrders) {
            return dataTemplate({error: "Không tìm thấy đơn hàng nào"}, 404)
        }
        const menuCollections = ["morning", "afternoon", "evening", "other"]
            .reduce((acc, cur) => ({
                ...acc,
                [`${cur}-menu`]: client.db(process.env.DB_NAME).collection(`${cur}-menu`)
            }), {});

        const orderList = new Array(foodOrders.orderList.length).fill(null);
        for (let i = 0; i < foodOrders.orderList.length; i++) {
            const item = foodOrders.orderList[i];
            const foodId = item.menuItem;
            let menuItem: any;
            for (const key in menuCollections) {
                const item = await menuCollections[key].findOne({_id: new ObjectId(foodId)});
                if (item) {
                    menuItem = item;
                    break;
                }
            }
            if (!menuItem) {
                return dataTemplate({error: "thêm sản phẩm không thành công"}, 404);
            }
            // if (menuItem.total_sold + item.totalOrder > menuItem.total) {
            //     return dataTemplate({error: "Sản phẩm đã hết hàng"}, 400);
            // }
            orderList[i] = {
                ...menuItem,
                totalOrder: item.totalOrder,
                takeNote: item.takeNote
            }
        }

        return dataTemplate({data: orderList}, 200)
    } catch (e: any) {
        return dataTemplate({error: e.message}, 500)
    }
}


