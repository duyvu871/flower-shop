import {NextRequest, NextResponse} from "next/server";
import {getServerAuthSession} from "@/lib/nextauthOptions";
import {UserInterface} from "types/userInterface";
import {UpdateFullUser} from "@/lib/update/update-full-user";
import {ObjectId} from "mongodb";
import {dataTemplate} from "@/helpers/returned_response_template";

export async function POST(req: NextRequest) {
    const session = await getServerAuthSession();
    if (!session) {
        return NextResponse.redirect('/');
    }
    const {user} = session;
    const userUpdate = await req.json() as Partial<UserInterface>;
    const updateUser = await UpdateFullUser(userUpdate, user._id as unknown as ObjectId);
    if (!updateUser) {
        return dataTemplate({error: "Update user failed"}, 500);
    }
    return dataTemplate(updateUser, 200);
}