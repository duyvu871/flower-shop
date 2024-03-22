import { NextResponse, NextRequest } from "next/server";
import { revalidateTag } from 'next/cache';
// import {ObjectId} from "mongodb";
import {getAllMenuList} from "@/lib/order";
// import {useSearchParams} from "next/navigation";
// import {timeOrder} from "types/order";
// import DBConfigs from "@/configs/database.config";
// export const revalidate = 360
export async function GET(req: NextRequest) {
    // const searchParams = new URL(req.url).searchParams;
    // const time = searchParams.get("time") as timeOrder;
    // const page = searchParams.get("page") as string;
    // const limit = searchParams.get("limit") || String(DBConfigs.perPage);
    // console.log(time);
    const allMenuList = await getAllMenuList();
    // revalidateTag('allMenuList');
    if (!allMenuList) {
        return NextResponse.json({error: "Xảy ra lỗi gì đó ở menu session"}, {status: 404});
    }

    return NextResponse.json(allMenuList, {status: 200});
}

export const dynamic = "force-dynamic";