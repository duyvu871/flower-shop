import {getServerAuthSession} from "@/lib/nextauthOptions";
import {NextRequest, NextResponse} from "next/server";
import {createPurchaseOrder} from "@/lib/purchase/createPurchaseOrder";
import {dataTemplate} from "@/helpers/returned_response_template";
import {getPurchaseHistory} from "@/lib/purchase/getHistory";

export async function POST(req: NextRequest) {
    const session = await getServerAuthSession();
    if (!session) {
        return NextResponse.redirect("/")
    }
    const payload = await req.json();
    const {amount, isPaid, items} = payload;
    const {user} = session;

    return createPurchaseOrder(amount, user._id, isPaid, items);
}

export async function GET(req: NextRequest) {
    const session = await getServerAuthSession();
    if (!session) {
        return NextResponse.redirect("/")
    }
    const id = req.nextUrl.searchParams.get("id");
    const page = req.nextUrl.searchParams.get("page");
    if (!id) {
        return dataTemplate({error: "Id không hợp lệ"}, 400);
    }
    const {user} = session;
    const response = await getPurchaseHistory(user._id, 10, Number(page) || 1);
    return dataTemplate(response, 200);
}