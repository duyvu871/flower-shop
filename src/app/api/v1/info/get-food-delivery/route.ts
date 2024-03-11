import { NextResponse, NextRequest } from "next/server";
import {ObjectId} from "mongodb";
import {getMenuList} from "@/lib/order";
import {useSearchParams} from "next/navigation";
import {timeOrder} from "types/order";

export async function GET(req: NextRequest) {
    const searchParams = new URL(req.url).searchParams;
    const time = searchParams.get("time") as timeOrder;
    console.log(time);
    const menuList = await getMenuList(time);

    if (!menuList) {
        return NextResponse.json({error: ""}, {status: 404});
    }

    return NextResponse.json(menuList, {status: 200});
}