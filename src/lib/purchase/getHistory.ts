import clientPromise from "@/lib/mongodb";
import {PurchaseOrderType} from "types/order";
import {ObjectId} from "mongodb";
import {dataTemplate} from "@/helpers/returned_response_template";

export async function getPurchaseHistory(userId: string, limit: number, page: number) {
    const client = await clientPromise;
    const collection = client.db(process.env.DB_NAME).collection("purchase-orders");
    const skip = (Number(page) - 1) * 10; // 0, 10, 20, 30
    const paginate = await collection.find({}).sort({createdAt: -1}).skip(skip).limit(Number(limit)).toArray();
    return {
        data: paginate,
        page,
        limit,
        perPage: 10
    }
}