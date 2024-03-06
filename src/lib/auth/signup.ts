import clientPromise from "@/lib/mongodb";
import bcrypt from "bcrypt";
import {extractProperties} from "@/helper/extractProperties";
import {uid} from "uid";

export async function signUp(credentials:  Record<"username" | "password", string> | undefined) {
    const client = await clientPromise;
    // console.log(credentials);
    const usersCollection = client
        .db(process.env.DB_NAME)
        .collection("users");
    const username = credentials?.username;
    const password = credentials?.password;

    if (!username || !password) {
        throw new Error("Invalid credentials");
    }

    const user = await usersCollection.findOne({ username});

    if (user) {
        throw new Error("User is exist.");
    }

    const doc = {
        username,
        password: bcrypt.hashSync(password as string, 10),
        role: "user",
        balance: 1000,
        id_index: await usersCollection.countDocuments() + 1,
        uid: uid(16)
            .split('')
            .map(char => char.charCodeAt(0).toLocaleString()[0])
            .join(''),
        virtualVolume: 1000,
        total_request_withdraw: 0,
        transactions: [],
        actionHistory: [],
        withDrawHistory: [],
        bankingInfo: {
            bank: "",
            accountNumber: "",
            accountName: "",
        },
    }
    const insertUser = await usersCollection.insertOne(doc);

    if (!insertUser) {
        throw new Error("Insert user failed");
    }

    return extractProperties(doc, ["id_index", "username", "role", "balance", "uid"]);
}