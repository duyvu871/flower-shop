import { NextResponse, NextRequest } from "next/server";
import { ObjectId, WithId } from "mongodb";
import { getServerAuthSession } from "@/lib/nextauthOptions";
import { CreateOrder } from "@/lib/order";
import { CartItemType } from "@/contexts/MenuDataContext";

export async function POST(req: NextRequest) {
    const session = await getServerAuthSession();
    if (!session) {
        return NextResponse.redirect("/");
    }
    const { user } = session;
    const { cart, location, takeNote, owner } = (await req.json()) as {
        cart: CartItemType[];
        location: string;
        takeNote: string;
        owner: string;
    };
    return await CreateOrder(cart, user._id, location, takeNote, owner);
}
export const dynamic = "force-dynamic";
