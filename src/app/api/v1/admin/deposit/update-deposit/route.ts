import {NextRequest} from "next/server";
import clientPromise from "@/lib/mongodb";
import {dataTemplate} from "@/helpers/returned_response_template";
import {ObjectId} from "mongodb";

export async function POST(request: NextRequest) {
    try {
        let depositValue = 0;
        const requestBody = await request.json();
        const {depositId, status} = requestBody;
        const client = await clientPromise;

        const depositCollection = client.db(process.env.DB_NAME).collection("purchase-orders");
        const updateDeposit = await depositCollection.updateOne({_id: new ObjectId(depositId)}, {$set: {isPaid: status.isPaid, confirmed: status.confirmed, updatedAt: new Date()}});

        if (!updateDeposit.acknowledged) return dataTemplate({message: "Cập nhật thất bại"}, 500);
        const deposit = await depositCollection.findOne({_id: new ObjectId(depositId)});
        if (!deposit) return dataTemplate({error: "Không tìm thấy đơn hàng"}, 404);
        if (deposit.isPaid && deposit.confirmed) return dataTemplate({error: "Đơn hàng đã được cập nhật trước đó"}, 400);
        if (status.isPaid && status.confirmed)  depositValue = deposit.amount;

        const userCollection = client.db(process.env.DB_NAME).collection("users");
        const updateDepositUser = await userCollection.updateOne({_id: new ObjectId(deposit.userId)}, {
            $inc: {
                balance: depositValue
            }
        });
        if (!updateDepositUser.acknowledged) return dataTemplate({message: "Cập nhật thất bại"}, 500);

        return dataTemplate({message: "Cập nhật thành công"}, 200);
    } catch (e) {
        return dataTemplate({error: e.error}, 400);
    }
}