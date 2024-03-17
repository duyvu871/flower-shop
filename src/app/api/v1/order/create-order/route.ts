import { NextResponse, NextRequest } from "next/server";
import {ObjectId, WithId} from "mongodb";
import { getServerAuthSession } from "@/lib/nextauthOptions";
import {CreateOrder} from "@/lib/order";
import {CartItemType} from "@/contexts/MenuDataContext";


export async function POST(req: NextRequest) {
    const session = await getServerAuthSession();
    if (!session) {
        return NextResponse.redirect("/")
    }
    const {user} = session;
    const cart = await req.json() as CartItemType[];
    return await CreateOrder(cart, user._id);
}