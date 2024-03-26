import {dataTemplate} from "@/helpers/returned_response_template";
import clientPromise from "@/lib/mongodb";
import {NextRequest} from "next/server";
import {ObjectId} from "mongodb";

export async function POST(request: NextRequest) {
    try {
        const requestBody = await request.json();
        const {productId, productType} = requestBody;
        if (!productId) {
            return dataTemplate({error: "Không tìm thấy id"}, 400);
        }
        const client = await clientPromise;
        const productCollection = client.db(process.env.DB_NAME).collection("products");
        const deleteProduct = await productCollection.deleteOne({_id: new ObjectId(productId)});
        if (!deleteProduct.acknowledged) {
            return dataTemplate({error: "Xóa sản phẩm thất bại"}, 500);
        }
        return dataTemplate({message: "Xóa sản phẩm thành công"}, 200);
    } catch (e) {
        return dataTemplate({error: e.error}, 400);
    }
}