import {NextRequest, NextResponse} from "next/server";
import {ObjectId} from "mongodb";
import { getServerAuthSession } from "@/lib/nextauthOptions";
import clientPromise from "@/lib/mongodb";

export async function POST(req: NextRequest) {
    const session = await getServerAuthSession();
    if (!session) {
        return NextResponse.redirect("/")//.json({error: "Unauthorized"}, {status: 401});
    }
    const { drawList } = await req.json() as {drawList: ObjectId[]};
    const {user} = session;
    const {_id} = user;
    const client = await clientPromise;
    const withdrawCollection = client.db(process.env.DB_NAME).collection("withdraws");
    const withdraws = await withdrawCollection.find({userId: new ObjectId(_id)}).toArray();
    if (!withdraws) {
        return NextResponse.json({error: "Không tìm thấy thông tin rút tiền"}, {status: 404});
    }

    return NextResponse.json(withdraws.reverse(), {status: 200});
}
export const dynamic = "force-dynamic";