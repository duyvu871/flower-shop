import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import nextauthOptions from "@/lib/nextauthOptions";
import { getUserData } from "@/lib/user/getUserData";
import {ObjectId} from "mongodb";



export async function GET(req: NextRequest) {
    const session = await getServerSession(nextauthOptions);
    if (!session) {
        return NextResponse.redirect("/")
    }

    const {user} = session;
    const userData = await getUserData(user._id as unknown as ObjectId);

    if (!userData) {
        return NextResponse.json({error: "User not found"}, {status: 404});
    }

    return NextResponse.json(userData, {status: 200});
}