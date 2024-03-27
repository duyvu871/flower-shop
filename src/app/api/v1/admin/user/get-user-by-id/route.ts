import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import nextauthOptions from "@/lib/nextauthOptions";
import { getUserData } from "@/lib/user/getUserData";
import {ObjectId} from "mongodb";
import {dataTemplate} from "@/helpers/returned_response_template";

export async function GET(req: NextRequest) {
    const id = req.nextUrl.searchParams.get("id");
    if (!id) {
        return dataTemplate({error: "Id is required"}, 400);
    }
    const userData = await getUserData(id as unknown as ObjectId);

    if (!userData) {
        return dataTemplate({error: "User not found"},  404);
    }

    return dataTemplate({data: userData}, 200);
}
export const dynamic = "force-dynamic";