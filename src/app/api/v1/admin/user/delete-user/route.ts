import {dataTemplate} from "@/helpers/returned_response_template";
import clientPromise from "@/lib/mongodb";
import {NextRequest} from "next/server";
import {ObjectId} from "mongodb";

export async function POST(request: NextRequest) {
    try {
        const requestBody = await request.json();
        const {userId} = requestBody;
        if (!userId) {
            return dataTemplate({error: "Không tìm thấy id"}, 400);
        }
        const client = await clientPromise;
        const userCollection = client.db(process.env.DB_NAME).collection("users");
        const deleteUser = await userCollection.deleteOne({_id: new ObjectId(userId)});
        console.log(deleteUser)
        if (!deleteUser.acknowledged) {
            return dataTemplate({error: "Xóa người dùng thất bại"}, 500);
        }
        if (!deleteUser.deletedCount) {
            return dataTemplate({error: "Không tìm thấy người dùng"}, 404);
        }
        return dataTemplate({message: "Xóa người dùng thành công"}, 200);
    } catch (e) {
        return dataTemplate({error: e.error}, 400);
    }
}