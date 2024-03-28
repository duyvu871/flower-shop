import clientPromise from "@/lib/mongodb";
import {PurchaseOrderType} from "types/order";
import {ObjectId} from "mongodb";
import {NextResponse} from "next/server";
import {dataTemplate} from "@/helpers/returned_response_template";

export async function createPurchaseOrder(amount: number, userId: string, isPaid: boolean = false, items: {id: string, quantity: number}[]) {

    const client = await clientPromise;
    const collection = client.db(process.env.DB_NAME).collection("purchase-orders");
    const userCollection = client.db(process.env.DB_NAME).collection("users");
    if (!collection) {
        return dataTemplate({error: "Hệ thống đang bận, vui lòng thử lại sau"}, 500);
    }
    const user = await userCollection.findOne({_id: new ObjectId(userId)});
    if (!user) {
        return dataTemplate({error: "Không tìm thấy người dùng"}, 404);
    }
    const defaultData: PurchaseOrderType = {
        _id: new ObjectId(),
        amount,
        paymentMethod: "bank",
        userId,
        status: "pending",
        isPaid: false,
        confirmed: true,
        items,
        createdAt: new Date(),
        updatedAt: new Date(),
    }
    const result = await collection.insertOne(defaultData);
    // console.log(result)
    if (!result.acknowledged) {
        return dataTemplate({error: "Lỗi khi tạo đơn nạp"}, 500);
    }

    return dataTemplate({data: defaultData, message: "Tạo đơn nạp thành công"}, 200);
}