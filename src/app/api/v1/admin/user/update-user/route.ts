import {NextRequest} from "next/server";
import clientPromise from "@/lib/mongodb";
import {dataTemplate} from "@/helpers/returned_response_template";
import {UserInterface} from "types/userInterface";
import {UpdateFullUser} from "@/lib/update/update-full-user";
import {ObjectId} from "mongodb";

export async function POST(request: NextRequest) {
    try {
        const requestBody = await request.json() as { _id: string, data: Partial<UserInterface> };
        const {_id, data} = requestBody;
        const updateUser = await UpdateFullUser(data, _id as unknown as ObjectId);
        if (!updateUser) {
            return dataTemplate({error: "Update user failed"}, 500);
        }
        return dataTemplate(updateUser, 200);
    } catch (e) {
        return dataTemplate({error: e.error}, 400);
    }
}

export const dynamic = "force-dynamic";