import {NextRequest, NextResponse} from "next/server";
import {dataTemplate} from "@/helpers/returned_response_template";
import clientPromise from "@/lib/mongodb";
import {ObjectId} from "mongodb";

export async function POST(request: NextRequest) {
    try {
        const requestBody = await request.json();
        const {id} = requestBody as {id: string};
        if (!id) {
            return dataTemplate({error: "Không tìm thấy id"}, 400);
        }

        const client = await clientPromise;
        const orderCollection = client.db(process.env.DB_NAME).collection("orders");
        const deleteOrder = await orderCollection.deleteOne({_id: new ObjectId(id) as unknown as ObjectId});
        if (!deleteOrder.acknowledged) {
            return dataTemplate({error: "Xóa đơn hàng thất bại"}, 500);
        }

        return dataTemplate({message: "Xóa đơn hàng thành công"}, 200);

    } catch (e) {
        // console.log(e);
        return new NextResponse(JSON.stringify({ error: e.error }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}