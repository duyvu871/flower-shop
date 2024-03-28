import {NextRequest} from "next/server";
import {getServerAuthSession} from "@/lib/nextauthOptions";
import {dataTemplate} from "@/helpers/returned_response_template";
import {ExportService} from "@/services/export-excel";
import clientPromise from "@/lib/mongodb";

import {startTime, TimeRange} from "@/ultis/timeFormat.ultis";


export async function GET(req: NextRequest) {
    const session = getServerAuthSession();
    if (!session) {
        return dataTemplate({error: "Unauthorized"}, 401);
    }
    const data = await session;
    if (data.user.role !== "admin") {
        return dataTemplate({error: "Unauthorized"}, 401);
    }
    const range = req.nextUrl.searchParams.get("range") as ("day" | "week" | "month" | "year" | "all") || "all";
    const timeStart = startTime(range);
    const client = await clientPromise;
    const orderCollection = client.db(process.env.DB_NAME).collection("food-orders");

    const allOrders = await orderCollection.find({
        createdAt: {
            $gte: timeStart
        }
    }).toArray();

    const orderResult = allOrders.map((order, index) => {
        return {
            "STT": index + 1,
            "Mã người dùng": String(order.userId),
            "Số đơn": order.orderList.reduce((acc, cur) => acc + cur.totalOrder, 0),
            "Tổng tiền": order.orderVolume,
            "Ghi chú": order.note || "",
            "Địa chỉ": order.location || "",
            "Trạng thái": order.status === "approved" ? "Đã duyệt" : "Chưa duyệt",
            "Thời gian tạo": order.createdAt,
            "Thời gian cập nhật": order.updatedAt,
        };
    })

    const exportService = new ExportService();
    const buffer = await exportService.exportDataForVisualization(orderResult, "donhang");

    const headers = new Headers();
    headers.append("Content-Disposition", 'attachment; filename="thongtindonhang-'+ TimeRange[range] +'.xlsb"');
    headers.append("Content-Type", "application/vnd.ms-excel");

    return new Response(buffer, {
        headers,
        // status: 200,
    });
}