import {NextRequest} from "next/server";
import clientPromise from "@/lib/mongodb";
import {dataTemplate} from "@/helpers/returned_response_template";

export async function POST(request: NextRequest) {
    try {
        const requestBody = await request.json();
        const {depositId, status} = requestBody;
        const client = await clientPromise;
        const depositCollection = client.db(process.env.DB_NAME).collection("withdraws");
        const updateDeposit = await depositCollection.updateOne({_id: depositId}, {$set: {status}});
        if (!updateDeposit.acknowledged) {
            return dataTemplate({message: "Cập nhật thất bại"}, 500);
        }
        return dataTemplate({message: "Cập nhật thành công"}, 200);
    } catch (e) {
        return dataTemplate({error: e.error}, 400);
    }
}