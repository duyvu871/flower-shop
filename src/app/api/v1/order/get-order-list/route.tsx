// import * as process from "process";
// import { promises as fs } from 'fs';
import {NextRequest, NextResponse} from "next/server";
// import axios, {isCancel, Axios, AxiosResponse} from "axios";
import AppConfig from "@/configs/App.config";
import { headers } from "next/headers";

// export const runtime = 'edge';
// export const dynamic = "force-dynamic"
export async function GET(request: Request) {
    try {
        // @ts-ignore
        const requestHeaders = headers(request);
        const access_token = requestHeaders.get("x-access-token");
        console.log("access_token: ", access_token);
        const response = await fetch(`${AppConfig.mainApiUrl}/order/get-order-list`, {
            method: "GET",
            // body: new URLSearchParams(),
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "x-access-token": access_token || ""
            },
        }).then(res => res.json());

        console.log(response)
        return new NextResponse(JSON.stringify(response || {}), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (e) {
        console.log(e);
        return new NextResponse(JSON.stringify({ error: "Error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });

    }
}

// export async function HEAD(request: NextRequest) {}
//
// export async function POST(request: NextRequest) {
//
// }
//
// export async function PUT(request: NextRequest) {}
//
// export async function DELETE(request: NextRequest) {}
//
// export async function PATCH(request: NextRequest) {}
//
// // If `OPTIONS` is not defined, Next.js will automatically implement `OPTIONS` and  set the appropriate Response `Allow` header depending on the other methods defined in the route handler.
// export async function OPTIONS(request: NextRequest) {}