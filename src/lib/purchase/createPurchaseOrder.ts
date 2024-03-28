import clientPromise from "@/lib/mongodb";
import {PurchaseOrderType} from "types/order";
import {ObjectId} from "mongodb";
import {NextResponse} from "next/server";
import {dataTemplate} from "@/helpers/returned_response_template";

export async function createPurchaseOrder(amount: number, userId: string, isPaid: boolean = false, items: {id: string, quantity: number}[]) {
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
    const client = await clientPromise;
    const collection = client.db(process.env.DB_NAME).collection("purchase-orders");
    const result = await collection.insertOne(defaultData);
    // console.log(result)
    if (!result.acknowledged) {
        return dataTemplate({error: "Lỗi khi tạo đơn nạp"}, 500);
    }

    return dataTemplate({data: defaultData, message: "Tạo đơn nạp thành công"}, 200);
}