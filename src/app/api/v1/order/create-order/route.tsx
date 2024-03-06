// import * as process from "process";
// import { promises as fs } from 'fs';
import {NextRequest, NextResponse} from "next/server";
// import axios, {isCancel, Axios, AxiosResponse} from "axios";
import AppConfig from "@/configs/App.config";
import { headers } from "next/headers";

// export const dynamic = "force-dynamic"
export async function GET(request: Request) {
    try {
        // @ts-ignore
        const requestHeaders = headers(request);
        const access_token = requestHeaders.get("x-access-token");
        // console.log("access_token: ", access_token);
        const response = await fetch(`${AppConfig.mainApiUrl}/auth/profile`, {
            method: "POST",
            body: new URLSearchParams(),
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "x-access-token": access_token || ""
            },
        }).then(res => res.json());

        // console.log(response)
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
