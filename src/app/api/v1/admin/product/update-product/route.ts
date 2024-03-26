import {dataTemplate} from "@/helpers/returned_response_template";
import clientPromise from "@/lib/mongodb";
import {NextRequest} from "next/server";
import {ObjectId} from "mongodb";

export async function POST(request: NextRequest) {
    try {
        const requestBody = await request.json();
        const {productId, productType, data} = requestBody;
        if (!productId) {
            return dataTemplate({error: "Không tìm thấy id"}, 400);
        }
        const client = await clientPromise;
        const productCollection = client.db(process.env.DB_NAME).collection(productType);
        const updateProduct = await productCollection.updateOne({_id: new ObjectId(productId)}, {
            $set: {
                ...data
            }
        });
        if (!updateProduct.acknowledged) {
            return dataTemplate({error: "Cập nhật sản phẩm thất bại"}, 500);
        }
        return dataTemplate({message: "Cập nhật sản phẩm thành công"}, 200);
    } catch (e) {
        return dataTemplate({error: e.error}, 400);
    }
}