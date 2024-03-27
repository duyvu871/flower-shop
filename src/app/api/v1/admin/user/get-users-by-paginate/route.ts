import {NextRequest} from "next/server";
import {dataTemplate} from "@/helpers/returned_response_template";
import clientPromise from "@/lib/mongodb";
import {UserInterface} from "types/userInterface";
import {revalidatePath} from "next/cache";

export async function GET(req: NextRequest) {
    try {
        const page = req.nextUrl.searchParams.get("page") ? parseInt(req.nextUrl.searchParams.get("page") as string) : 0;
        const limit = req.nextUrl.searchParams.get("limit") ? parseInt(req.nextUrl.searchParams.get("limit") as string) : 10;
        const client = await clientPromise;
        const users = client.db(process.env.DB_NAME).collection("users");
        const result = await users.find().project([
            '_id',                    'avatar',
            'fullName',               'email',
            'phone',
            'role',                   'balance',
            'id_index',               'uid',
            'virtualVolume',          'isLoyalCustomer',
            'total_request_withdraw', 'revenue',
            'orders',                 'address',
            'cart',                   'orderHistory',
            'transactions',           'actionHistory',
            'withDrawHistory',        'bankingInfo'
        ]).skip((page - 1) * limit ).limit(limit).toArray();
        const count = await users.countDocuments();
        if (result.length === 0) {
            return dataTemplate({error: "Không tìm thấy người dùng"}, 404);
        }
        revalidatePath("/admin/dashboard");

        return dataTemplate({data: result as UserInterface[], count}, 200);
    } catch (e) {
        console.log(e);
        return dataTemplate({error: e.error}, 400)
    }
}

export const dynamic = "force-dynamic";