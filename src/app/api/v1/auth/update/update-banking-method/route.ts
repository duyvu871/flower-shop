import {NextRequest, NextResponse} from "next/server";
import { getServerAuthSession } from "@/lib/nextauthOptions";
import {BankingMethodUpdate, UserSessionPayload} from "@/services/interface.authenticate";
import {updateBankingMethod} from "@/lib/update/banking-method";
import {ObjectId} from "mongodb";
import {messageTemplate} from "@/helpers/returned_response_template";

export async function POST(req: NextRequest) {
    const session = await getServerAuthSession();
    if (!session) {
        return NextResponse.redirect('/');
    }
    const {user} = session;
    const {
        bank, accountName, accountNumber
    } = await req.json() as BankingMethodUpdate;
    const updateAction = await updateBankingMethod({bank, accountName, accountNumber}, user._id as unknown as ObjectId);
    // console.log(updateAction);
    if (!updateAction) {
        return messageTemplate("Update banking method failed", 500);
    }

    return messageTemplate("Update banking method successfully", 200);
}