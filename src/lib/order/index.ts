import {OrderType} from "types/order";
import clientPromise from "@/lib/mongodb";
import {ObjectId} from "mongodb";
import {NextResponse} from "next/server";
import DBConfigs from "@/configs/database.config";

type WithdrawPayload = {
    volume: number;
    uid: string;
}

export async function CreateOrder(orderData: WithdrawPayload) {
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

    const withdrawOrder: OrderType = {
        _id: new ObjectId(),
        userId: new ObjectId(uid),
        type: "withdrawal",
        volume,
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

export async function CreateOrderByCronjob() {
    const client = await clientPromise;
    const orderCollection = client.db(process.env.DB_NAME).collection("orders");
    const orderResultDocs = {
        status: "pending",
    }
    // const previousOrder =

}

export async function getMenuList(time: "morning" | "afternoon" | "evening"| "night", page: number, limit: number) {
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

export type MenuListWithPaginate = ReturnType<typeof getMenuList>;