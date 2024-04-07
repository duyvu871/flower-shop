import { NextRequest } from "next/server";
import { getServerAuthSession } from "@/lib/nextauthOptions";
import { dataTemplate } from "@/helpers/returned_response_template";
import { ExportService } from "@/services/export-excel";
import clientPromise from "@/lib/mongodb";

import { startTime, TimeRange } from "@/ultis/timeFormat.ultis";

export async function GET(req: NextRequest) {
    const session = getServerAuthSession();
    if (!session) {
        return dataTemplate({ error: "Unauthorized" }, 401);
    }
    const data = await session;
    if (data.user.role !== "admin") {
        return dataTemplate({ error: "Unauthorized" }, 401);
    }
    const range =
        (req.nextUrl.searchParams.get("range") as
            | "day"
            | "week"
            | "month"
            | "year"
            | "all") || "all";
    const timeStart = startTime(range);
    const client = await clientPromise;
    const purchaseCollection = client
        .db(process.env.DB_NAME)
        .collection("purchase-orders");

    const allOrders = await purchaseCollection
        .find({
            createdAt: {
                $gte: timeStart,
            },
        })
        .toArray();

    const orderResult = allOrders.map((order, index) => {
        return {
            STT: index + 1,
            "Mã người dùng": String(order.userId),
            "Tổng tiền": order.amount,
            "Đã trả": order.isPaid ? "Đã thanh toán" : "Chưa thanh toán",
            "Trạng thái": order.confirmed ? "Đã duyệt" : "Chưa duyệt",
            "Thời gian tạo": order.createdAt,
            "Thời gian cập nhật": order.updatedAt,
        };
    });

    const exportService = new ExportService();
    const buffer = await exportService.exportDataForVisualization(
        orderResult,
        "naptien",
    );

    const headers = new Headers();
    headers.append(
        "Content-Disposition",
        'attachment; filename="thontinnaptien-' + TimeRange[range] + '.xlsx"',
    );
    headers.append("Content-Type", "application/vnd.ms-excel");

    return new Response(buffer, {
        headers,
        // status: 200,
    });
}
