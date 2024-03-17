import {OrderType} from "types/order";
import {ObjectId} from "mongodb";
import DBConfigs from "@/configs/database.config";
import {CartItemType} from "@/contexts/MenuDataContext";
import {calculateCart} from "@/helpers/calculateCart";
import {messageTemplate, dataTemplate} from "@/helpers/returned_response_template";
import {getGlobalConfig} from "@/lib/globalConfig";
import clientPromise from "@/lib/mongodb";
import {Await} from "@/helpers/helpers-type";

export async function CreateOrder(cart: CartItemType[], uid: string) {
    const client =await clientPromise;
    const globalConfig = getGlobalConfig();
    const userCollection = client.db(process.env.DB_NAME).collection("users");
    const foodOrderCollection = client.db(process.env.DB_NAME).collection("food-orders");

    if (userCollection === null || foodOrderCollection === null) {
        return dataTemplate({error: "Hệ thống đang bận, vui lòng thử lại sau"}, 500);
    }
    const userData = await userCollection.findOne({_id: new ObjectId(uid)}); // get user data
    if (!userData) {
        return dataTemplate({error: "Không tìm thấy người dùng trong hệ thống"}, 404);
    }
    const orderVolume = calculateCart(cart); // calculate total order volume
    // if (userData.balance < orderVolume) {
    //     return dataTemplate({error: "Số dư không đủ"}, 400);
    // }

    const orderDataInsert: OrderType = {
        _id: new ObjectId(),
        userId: new ObjectId(uid),
        orderList: cart.map((item) => {
            return {
                menuItem: new ObjectId(item._id),
                totalOrder: item.totalOrder,
                takeNote: item.takeNote
            }
        }),
        orderVolume,
        promotions: 0,
        status: "pending",
        isHandled: false,
        handlerId: new ObjectId(),
        receive: 0,
        createdAt: new Date(),
        updatedAt: new Date()
    } //

    const orderAction = await foodOrderCollection.insertOne(orderDataInsert);// create order

    if (!orderAction) {
        return dataTemplate({error: "Lỗi khi tạo đơn hàng"}, 500);
    }
    if (orderAction.acknowledged) {
        return dataTemplate({error: "Thông tin đơn hàng chưa được thêm vào hệ thống"}, 500);
    }

    const userBalanceAfterUpdate = userData.balance - orderVolume; // update user balance
    if (userBalanceAfterUpdate < -(globalConfig.allowedDebtLimit as number)) {
        return dataTemplate({error: "Đã quá mức nợ cho phép"}, 400);
    }
    // if (userBalanceAfterUpdate < 0) {
    //     return dataTemplate({error: "Số dư không đủ"}, 400);
    // }
    const updateUserBalance =  await userCollection.updateOne({_id: new ObjectId(uid)}, {
        $inc: {balance: - orderVolume},
        // @ts-ignore
        $push: {
            withDrawHistory: {
                $each: [orderDataInsert._id],
                $position: 0
            }
        }
    });

    if (!updateUserBalance) {
        return dataTemplate({error: "Lỗi khi cập nhật số dư"}, 500);
    }

    return dataTemplate({
        message: "Yêu cầu đơn hàng đã được thêm vào hệ thống",
        balance: userBalanceAfterUpdate,
        orderData: orderDataInsert
    },  200);
}


export async function getMenuList(time: "morning" | "afternoon" | "evening"| "night"|"other", page: number, limit: number) {
    const perPage = DBConfigs.perPage; // 10
    const client = await clientPromise; // connect to database
    const orderCollection = client.db(process.env.DB_NAME).collection(`${DBConfigs.menu[time]}-menu`);
    const count = await orderCollection.countDocuments(); // count total documents
    const skip = (Number(page) - 1) * perPage; // 0, 10, 20, 30
    const paginate = await orderCollection.find({}).skip(skip).limit(Number(limit)).toArray(); // 10, 10, 10, 10
    return {
        data: paginate,
        count,
        page,
        limit,
        perPage
    }
}

export type GetMenuListType = Await<ReturnType<typeof getMenuList>>;

export async function getAllMenuList() {
    // const client = clientPromise;
    const morningMenu = getMenuList("morning", 1, 2);
    const afternoonMenu = getMenuList("afternoon", 1, 2);
    const eveningMenu = getMenuList("evening", 1, 2);
    // const nightMenu = getMenuList("night", 1, 10);
    const otherMenu = getMenuList("other", 1, 10);
    const result = await Promise.all([morningMenu, afternoonMenu, eveningMenu, otherMenu]);
    return {
        morning: result[0],
        afternoon: result[1],
        evening: result[2],
        other: result[3]
    }
};

export type MenuListWithPaginate = ReturnType<typeof getMenuList>;