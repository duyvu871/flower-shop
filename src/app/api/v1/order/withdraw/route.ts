import { NextResponse, NextRequest } from "next/server";
import {ObjectId, WithId} from "mongodb";
import { getServerAuthSession } from "@/lib/nextauthOptions";

import {CreateOrder, CreateWithdrawOrder} from "@/lib/order";

type WithdrawPayload = {
    volume: number;
    uid: string;
}


export async function POST(req: NextRequest) {
    const session = await getServerAuthSession();
    if (!session) {
        return NextResponse.redirect("/")
    }
    const {user} = session;
    const {volume, uid} = await req.json() as WithdrawPayload;
    return await CreateWithdrawOrder({volume, uid});
}