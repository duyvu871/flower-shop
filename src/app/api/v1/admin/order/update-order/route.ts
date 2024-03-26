import {NextRequest} from "next/server";
import {dataTemplate} from "@/helpers/returned_response_template";
import clientPromise from "@/lib/mongodb";
import {ObjectId} from "mongodb";

export async function POST(request: NextRequest) {
    try {
        const requestBody = await request.json();
        const {orderId, data} = requestBody;
        if (!orderId) {
            return dataTemplate({error: "Không tìm thấy id"}, 400);
        }
        if (!data) {
            return dataTemplate({error:"Không có dữ liệu cập nhật"}, 400);
        }

        const client = await clientPromise;
        const orderCollection = client.db(process.env.DB_NAME).collection("orders");
        const updateOrder = await orderCollection.updateOne({_id: new ObjectId(orderId)}, {
            $set: data
        });
        if (!updateOrder.acknowledged) {
            return dataTemplate({error: "Cập nhật đơn hàng thất bại"}, 500);
        }

        return dataTemplate({message: "Cập nhật đơn hàng thành công"}, 200);
    } catch (e) {
        return dataTemplate({error: e.error}, 400);
    }
}