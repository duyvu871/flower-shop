import {NextRequest} from "next/server";
import {dataTemplate} from "@/helpers/returned_response_template";
import clientPromise from "@/lib/mongodb";

export async function GET(req: NextRequest) {
    try {
        const page = req.nextUrl.searchParams.get("page") ? parseInt(req.nextUrl.searchParams.get("page") as string) : 0;
        const limit = req.nextUrl.searchParams.get("limit") ? parseInt(req.nextUrl.searchParams.get("limit") as string) : 10;
        const client = await clientPromise;
        const depositCollection = client.db(process.env.DB_NAME).collection("purchase-orders");
        const result = await depositCollection.find().sort({createdAt: -1}).skip((page - 1) * limit ).limit(limit).toArray();
        const count = await depositCollection.countDocuments();
        if (result.length === 0) {
            return dataTemplate({error: "Không tìm thấy đơn nạp tiền"}, 404);
        }

        return dataTemplate({data: result, count}, 200);
    } catch (e: any) {
        return dataTemplate({error: e.message}, 500)
    }

}

export const dynamic = "force-dynamic";