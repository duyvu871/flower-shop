import {NextRequest, NextResponse} from "next/server";
import {updatePassword} from "@/lib/update/update-password";
import {ObjectId} from "mongodb";
import {getServerAuthSession} from "@/lib/nextauthOptions";
import {messageTemplate} from "@/helpers/returned_response_template";

type UpdatePasswordPayload = {
    newPassword: string;
    oldPassword: string;
    confirmPassword: string;
}

export async function POST(req: NextRequest) {
    try {
        const session = await getServerAuthSession();
        if (!session) {
            return NextResponse.redirect('/');
        }
        const {user} = session;
        const {newPassword, confirmPassword, oldPassword} = await req.json() as UpdatePasswordPayload

        const updateAction = await updatePassword({newPassword, oldPassword}, user._id as unknown as ObjectId);

        if (!updateAction.matchedCount) {
            return messageTemplate("Không có tài khoản nào khớp với thông tin cập nhật", 500);
        }
        if (!updateAction.modifiedCount) {
            return messageTemplate("Cập nhật mật khẩu thất bại", 500);
        }

        return messageTemplate("Cập nhật mật khẩu thành công", 200);

    } catch (e: any) {
        return messageTemplate(e.message, 500);
    }
}