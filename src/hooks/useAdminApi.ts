// "use client"
import {UserInterface} from "types/userInterface";
import clientPromise from "@/lib/mongodb";
import {MenuItemType} from "types/order";
import {quickSortByProperty} from "@/helpers/quickSort";

export function useAdminApi() {
    const updateUserInfo = async (data: Partial<UserInterface>) => {

    }

    const getUserByPagination = async (page: number, limit: number) => {
        // "use server";
        const client = await clientPromise;
        const users = client.db(process.env.DB_NAME).collection("users");
        const result = await users.find().skip(page * limit).limit(limit).toArray();
        return result as UserInterface[];
    }

    const getBestSellingProduct = async () => {
        "use server";

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
        return quickSortByProperty<MenuItemType>(flattenResult, "total_sold", "descending");
    }

    const getCountOfUser = async () => {
        // "use server";
        const client = await clientPromise;
        const users = client.db(process.env.DB_NAME).collection("users");
        return await users.countDocuments();
    }

    return {
        updateUserInfo,
        getBestSellingProduct,
        getUserByPagination,
        getCountOfUser
    }
}