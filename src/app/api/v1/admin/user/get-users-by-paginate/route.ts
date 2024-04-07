import { NextRequest } from "next/server";
import { dataTemplate } from "@/helpers/returned_response_template";
import clientPromise from "@/lib/mongodb";
import { UserInterface } from "types/userInterface";
import { revalidatePath } from "next/cache";

export async function GET(req: NextRequest) {
    try {
        const page = req.nextUrl.searchParams.get("page")
            ? parseInt(req.nextUrl.searchParams.get("page") as string)
            : 0;
        const limit = req.nextUrl.searchParams.get("limit")
            ? parseInt(req.nextUrl.searchParams.get("limit") as string)
            : 10;
        const filterKey = req.nextUrl.searchParams.get("filterKey")
            ? (req.nextUrl.searchParams.get("filterKey") as string)
            : "createdAt";
        const filterOrder = req.nextUrl.searchParams.get("filterOrder")
            ? (req.nextUrl.searchParams.get("filterOrder") as string)
            : "desc";
        const searchString = req.nextUrl.searchParams.get("search") || "";
        const regex = new RegExp(
            [
                "",
                searchString
                    .split(" ")
                    .map((item) => `(?=.*${item})`)
                    .join("|"),
                "",
            ].join(""),
            "i",
        );

        const filters = !searchString
            ? {}
            : {
                  fullName: {
                      $regex: regex,
                  },
              };

        // console.log(searchString)
        const client = await clientPromise;
        const users = client.db(process.env.DB_NAME).collection("users");
        const result = await users
            .find(filters)
            .sort({
                [filterKey]: filterOrder === "asc" ? 1 : -1,
            })
            .project([
                "_id",
                "avatar",
                "fullName",
                "email",
                "phone",
                "status",
                "role",
                "balance",
                "id_index",
                "uid",
                "virtualVolume",
                "isLoyalCustomer",
                "total_request_withdraw",
                "revenue",
                "orders",
                "address",
                "cart",
                "orderHistory",
                "transactions",
                "actionHistory",
                "withDrawHistory",
                "bankingInfo",
            ])
            .skip((page - 1) * limit)
            .limit(limit)
            .toArray();
        const count = await users.countDocuments();
        if (result.length === 0) {
            return dataTemplate({ error: "Không tìm thấy người dùng" }, 404);
        }
        revalidatePath("/admin/dashboard");

        return dataTemplate({ data: result as UserInterface[], count }, 200);
    } catch (e) {
        console.log(e);
        return dataTemplate({ error: e.error }, 400);
    }
}

export const dynamic = "force-dynamic";
