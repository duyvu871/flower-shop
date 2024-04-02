import {OrderType, OrderWithDrawType} from "types/order";
import {ObjectId} from "mongodb";
import DBConfigs from "@/configs/database.config";
import {CartItemType} from "@/contexts/MenuDataContext";
import {calculateCart} from "@/helpers/calculateCart";
import {dataTemplate} from "@/helpers/returned_response_template";
import {getGlobalConfig} from "@/lib/globalConfig";
import clientPromise from "@/lib/mongodb";
import {Await} from "@/helpers/helpers-type";
import {NextResponse} from "next/server";

type WithdrawPayload = {
    volume: number;
    uid: string;
}


export async function CreateOrder(cart: CartItemType[], uid: string, location: string, takeNote: string) {
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
    const orderVolume = calculateCart(cart)*1000; // calculate total order volume
    // if (userData.balance < orderVolume) {
    //     return dataTemplate({error: "Số dư không đủ"}, 400);
    // }
    const userBalanceAfterUpdate = userData.balance - orderVolume; // update user balance
    // console.log("userBalanceAfterUpdate", userBalanceAfterUpdate);
    // console.log("orderVolume", orderVolume);
    // console.log("allowedDebitLimit", userData.allowDebitLimit);
    if (userBalanceAfterUpdate < 0 && !userData.isLoyalCustomer) {
        return dataTemplate({error: "Số dư không đủ"}, 400);
    }
    if (userBalanceAfterUpdate < -(userData.allowDebitLimit as number)) {
        return dataTemplate({error: "Đã quá mức nợ cho phép"}, 400);
    }

    const menuCollections = ["morning", "afternoon", "evening", "other"]
        .reduce((acc, cur) => ({
            ...acc,
            [`${cur}-menu`]: client.db(process.env.DB_NAME).collection(`${cur}-menu`)
        }), {});
    // console.log(menuCollections);
    const orderList = new Array(cart.length).fill(null);
    for (let i = 0; i < cart.length; i++) {
        const item = cart[i];
        const menuType = item.type;
        const menuItem = await menuCollections[menuType].updateOne({_id: new ObjectId(item._id)}, {
            $inc: {total_sold: item.totalOrder}
        });
        if (!menuItem) {
            return dataTemplate({error: "thêm sản phẩm không thành công"}, 404);
        }
        // if (menuItem.total_sold + item.totalOrder > menuItem.total) {
        //     return dataTemplate({error: "Sản phẩm đã hết hàng"}, 400);
        // }
        orderList[i] = {
            name: item.name,
            menuItem: new ObjectId(item._id),
            totalOrder: item.totalOrder,
            takeNote: item.takeNote,
            menuType
        }
    }

    const orderDataInsert: OrderType = {
        _id: new ObjectId(),
        userId: new ObjectId(uid),
        orderList,
        takeNote,
        location,
        orderVolume,
        promotions: 0,
        status: "approved",
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
    if (!orderAction.acknowledged) {
        return dataTemplate({error: "Thông tin đơn hàng chưa được thêm vào hệ thống"}, 500);
    }

    // if (userBalanceAfterUpdate < 0) {
    //     return dataTemplate({error: "Số dư không đủ"}, 400);
    // }
    const updateUserBalance =  await userCollection.updateOne({_id: new ObjectId(uid)}, {
        $inc: {
            balance: - orderVolume,
            orders: orderList.reduce((acc, order) => acc + order.totalOrder, 0),
            revenue: orderVolume
        },
        // @ts-ignore
        $push: {
            // @ts-ignore
            orderHistory: {
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

export async function getHistory(collection: string, uid: string, page: number, limit: number) {
    const perPage = DBConfigs.perPage; // 10
    const client = await clientPromise; // connect to database
    const orderCollection = client.db(process.env.DB_NAME).collection(collection);
    const count = await orderCollection.countDocuments(); // count total documents
    const skip = (Number(page) - 1) * perPage; // 0, 10, 20, 30
    const paginate = await orderCollection.find({userId: new ObjectId(uid)}).sort({createdAt: -1}).skip(skip).limit(Number(limit)).toArray(); // 10, 10, 10, 10
    return {
        data: paginate,
        count,
        page,
        limit,
        perPage
    }
}

export async function getDocumentByIds(collection: string, ids: string[], projection: string[] = []) {
    const client = await clientPromise;
    const orderCollection = client.db(process.env.DB_NAME).collection(collection);
    return await orderCollection.find({_id: {$in: ids.map((id) => new ObjectId(id))}}).project(projection).toArray();
}

export async function CreateWithdrawOrder(orderData: WithdrawPayload) {
    const {uid, volume} = orderData;
    const client = await clientPromise;
    const userCollection = client.db(process.env.DB_NAME).collection("users");
    const withdrawCollection = client.db(process.env.DB_NAME).collection("withdraws");

    const userData = await userCollection.findOne({_id: new ObjectId(uid)});
    if (!userData) {
        return NextResponse.json({error: "Không tìm thấy người dùng trong hệ thống"}, {status: 404});
    }
    if (userData.balance < volume) {
        return NextResponse.json({error: "Số dư không đủ"}, {status: 400});
    }

    const withdrawOrder: OrderWithDrawType = {
        _id: new ObjectId(),
        userId: new ObjectId(uid),
        type: "withdrawal",
        orderVolume: volume,
        promotions: 0,
        status: "pending",
        isHandled: false,
        handlerId: new ObjectId(),
        receive: 0,
        createdAt: new Date(),
        updatedAt: new Date()
    }

    const withdrawAction = await withdrawCollection.insertOne(withdrawOrder);

    if (!withdrawAction.acknowledged) {
        return NextResponse.json({error: "Thông tin rút tiền chưa được thêm vào hệ thống"}, {status: 500});
    }

    const userBalanceAfterUpdate = userData.balance - volume;

    if (userBalanceAfterUpdate < 0) {
        return NextResponse.json({error: "Số dư không đủ"}, {status: 400});
    }

    const updateUserBalance =  await userCollection.updateOne({_id: new ObjectId(uid)}, {
        $inc: {balance: -volume},
        // @ts-ignore
        $push: {
            // @ts-ignore
            withDrawHistory: {
                $each: [withdrawOrder._id],
                $position: 0
            }
        }
    });

    return NextResponse.json({
        message: "Yêu cầu rút tiền đã được thêm vào hệ thống",
        balance: userBalanceAfterUpdate,
        withdrawData: withdrawOrder
    }, {status: 200});
}


export async function getMenuList(
    time: "morning" | "afternoon" | "evening"| "night"|"other",
    page: number,
    limit: number,
    role: "admin"|"user" = "user",
    {filterKey, filterOrder}:{filterKey: string, filterOrder: string} = {filterKey: "createdAt", filterOrder: "asc"},
    searchValue: string = ""
) {
    const perPage = DBConfigs.perPage; // 10
    const client = await clientPromise; // connect to database
    const orderCollection = client.db(process.env.DB_NAME).collection(`${DBConfigs.menu[time]}-menu`);
    const count = await orderCollection.countDocuments(); // count total documents
    const skip = (Number(page) - 1) * perPage; // 0, 10, 20, 30
    const regex = new RegExp(["", searchValue.split(" ").map(item => `(?=.*${item})`).join("|"), ""].join(""), "i");
    const filter = (role === "admin")
        ? searchValue ? {name: {$regex: regex}} : {}
        : time === "other" ? {} : {isSelect: true};
    const paginate = await orderCollection.find(filter).sort({
        [filterKey]: filterOrder === "asc" ? 1 : -1
    }).skip(skip).limit(Number(limit)).toArray(); // 10, 10, 10, 10
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
    const morningMenu = getMenuList("morning", 1, 10);
    const afternoonMenu = getMenuList("afternoon", 1, 10);
    const eveningMenu = getMenuList("evening", 1, 10);
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