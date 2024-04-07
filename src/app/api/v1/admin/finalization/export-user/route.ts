import { NextRequest } from "next/server";
import path from "path";
import { readFile } from "fs/promises";
import { getServerAuthSession } from "@/lib/nextauthOptions";
import { dataTemplate } from "@/helpers/returned_response_template";
import { ExportService } from "@/services/export-excel";
import clientPromise from "@/lib/mongodb";
import { UserInterface } from "types/userInterface";
import mime from "mime";

export async function GET(req: NextRequest) {
    const session = getServerAuthSession();
    if (!session) {
        return dataTemplate({ error: "Unauthorized" }, 401);
    }
    const data = await session;
    if (data.user.role !== "admin") {
        return dataTemplate({ error: "Unauthorized" }, 401);
    }
    const client = await clientPromise;
    const users = client.db(process.env.DB_NAME).collection("users");
    const allUsers = await users.find().toArray();
    const exportService = new ExportService();
    const buffer = await exportService.exportAllUserDataToExcel(
        allUsers as UserInterface[],
    );

    const headers = new Headers();
    headers.append(
        "Content-Disposition",
        'attachment; filename="thontinnguoidung.xlsx"',
    );
    headers.append("Content-Type", "application/vnd.ms-excel");

    return new Response(buffer, {
        headers,
        // status: 200,
    });
}
