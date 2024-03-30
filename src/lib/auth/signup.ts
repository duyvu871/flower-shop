import clientPromise from "@/lib/mongodb";
import bcrypt from "bcrypt";
import {extractProperties} from "@/helpers/extractProperties";
import {uid} from "uid";
import {UserInterface} from "types/userInterface";
import {ObjectId} from "mongodb";

export async function signUp(credentials:  Record<"fullName"|"password"|"phone"|"email", string> | undefined) {
    const client = await clientPromise;
    // console.log(credentials);
    const usersCollection = client
        .db(process.env.DB_NAME)
        .collection("users");
    const fullName = credentials?.fullName;
    const password = credentials?.password;
    const email = credentials?.email;
    const phone = credentials?.phone;

    if (!fullName || !password) {
        throw new Error("Invalid credentials");
    }

    const user = await usersCollection.findOne({
        // email: credentials.email,
        fullName: credentials.fullName,
        phone: credentials.phone
    });
    // console.log(user)
    if (user) {
        throw new Error("Tài khoản đã tồn tại");
    }

    const doc: UserInterface = {
        _id: new ObjectId(),
        avatar: "",
        fullName,
        email: email as string || "",
        phone: phone as string,
        password: bcrypt.hashSync(password as string, 10),
        role: "user",
        balance: 1000,
        id_index: await usersCollection.countDocuments() + 1,
        uid: uid(16)
            .split('')
            .map(char => char.charCodeAt(0).toLocaleString()[0])
            .join(''),
        virtualVolume: 1000,
        isLoyalCustomer: false,
        status: true,
        total_request_withdraw: 0,
        revenue: 0,
        orders: 0,
        address: "",
        cart: [],
        orderHistory: [],
        transactions: [],
        actionHistory: [],
        withDrawHistory: [],
        bankingInfo: {
            bank: "",
            accountNumber: "",
            accountName: "",
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        allowDebitLimit: 1000,
    }

    const insertUser = await usersCollection.insertOne(doc);

    if (!insertUser) {
        throw new Error("Insert user failed");
    }

    return extractProperties(doc, ["id_index", "fullName", "role", "balance", "uid", "_id"]);
}