import clientPromise from "@/lib/mongodb";
import {MenuItemType} from "types/order";
import {quickSortByProperty} from "@/helpers/quickSort";
import {dataTemplate} from "@/helpers/returned_response_template";
import {revalidatePath} from "next/cache";

export async function GET() {
    try {
        const client = await clientPromise;
        const menuCollections = ["morning", "afternoon", "evening", "other"]
            .reduce((acc, cur) => ({
                ...acc,
                [`${cur}-menu`]: client.db(process.env.DB_NAME).collection(`${cur}-menu`)
            }), {});
        const pipeline = [
            {$sort: {total_sold: 1}}, // sort by total_sold
            // { $limit: 2}
            // {
            //     $project: {
            //         _id: 1,
            //         name: 1,
            //         total_sold: 1,
            //         price: 1,
            //         description: 1,
            //         image: 1,
            //         type: 1,
            //     }
            // }
        ];
        const result = await Promise.all(Object.keys(menuCollections).map(async (collection) => {
            return await menuCollections[collection].aggregate(pipeline).toArray() as MenuItemType[];
        }));
        const flattenResult = result.flat();
        const sortedList = quickSortByProperty<MenuItemType>(flattenResult, "total_sold", "descending");
        revalidatePath("/admin/dashboard");

        return dataTemplate({data: sortedList}, 200);
    } catch (e) {
        return dataTemplate({error: e.error}, 400)
    }
}

export const dynamic = "force-dynamic";