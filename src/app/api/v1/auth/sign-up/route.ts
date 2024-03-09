import {NextRequest, NextResponse} from "next/server";
import {signUp} from "@/lib/auth/signup";

interface ISignUpRequest {
    fullName: string;
    password: string;
    email: string;
    phone: string;
}

export async function POST(request: NextRequest) {
    try {
        const json: ISignUpRequest = await request.json();
        console.log(json);

        const response = await signUp({...json});

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
