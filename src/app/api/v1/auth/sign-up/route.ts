import {NextRequest, NextResponse} from "next/server";
import {signUp} from "@/lib/auth/signup";

interface ISignUpRequest {
    username: string;
    password: string;
    email: string;
    phone: string;
}

export async function POST(request: NextRequest) {
    try {
        const json: ISignUpRequest = await request.json();
        console.log(json);
        const {username , password} = json;

        const response = await signUp({username, password});

        return new NextResponse(JSON.stringify(response), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (e: any) {
        // console.log(e);
        return new NextResponse(JSON.stringify({ error: e.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}
