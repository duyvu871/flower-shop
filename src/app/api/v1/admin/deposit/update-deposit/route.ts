import {NextRequest} from "next/server";
import clientPromise from "@/lib/mongodb";
import {dataTemplate} from "@/helpers/returned_response_template";
import {ObjectId} from "mongodb";

export async function POST(request: NextRequest) {
    try {
        const requestBody = await request.json();
        const {depositId, status} = requestBody;
        const client = await clientPromise;
        const depositCollection = client.db(process.env.DB_NAME).collection("purchase-orders");
        const updateDeposit = await depositCollection.updateOne({_id: new ObjectId(depositId)}, {$set: {status}});

        if (!updateDeposit.acknowledged) return dataTemplate("Cập nhật thất bại", 500);

        const deposit = await depositCollection.findOne({_id: new ObjectId(depositId)});
        const userCollection = client.db(process.env.DB_NAME).collection("users");
        const updateDepositUser = await userCollection.updateOne({_id: new ObjectId(deposit.userId)}, {
            $inc: {
                balance: deposit.amount
            }
        });
        if (!updateDepositUser.acknowledged) return dataTemplate("Cập nhật thất bại", 500);

        return dataTemplate("Cập nhật thành công", 200);
    } catch (e) {
        return dataTemplate({error: e.error}, 400);
    }
}