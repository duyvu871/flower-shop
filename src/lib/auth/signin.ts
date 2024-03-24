import clientPromise from "@/lib/mongodb";
import bcrypt from "bcrypt";
import {extractProperties} from "@/helpers/extractProperties";

type UserRecord<T extends "username" | "password" | "role"> = T extends "role"
    ? {
        admin: {
            email: string;
            password: string;
            role: "admin";
        };
        user: {
            username: string;
            password: string;
            role: "user";
        };
    }["admin" | "user"]
    : T extends "email"
        ? { email: string }
        : T extends "password"
            ? { password: string }
            : never;

export async function signIn(credentials:  UserRecord<"role"> | undefined) {
    const client = await clientPromise;
    // console.log(credentials);
    if (credentials.role !== "admin" && credentials.role !== "user") {
        throw new Error("Role is required.");
    }
    if (credentials.role === "admin") {
        const adminsCollection = client
            .db(process.env.DB_NAME)
            .collection("admin");
        const email = credentials?.email;
        if (!email) {
            throw new Error("Email is required.");
        }
        const admin = await adminsCollection.findOne({email});
        if (!admin) {
            throw new Error("Admin does not exist.");
        }
        const passwordIsValid = await bcrypt.compare(
            credentials?.password!,
            admin.password
        );
        if (!passwordIsValid) {
            throw new Error("Mật khẩu không đúng");
        }
        return extractProperties(admin, ["email", "role", "uid", "_id"]);
    }
    const usersCollection = client
        .db(process.env.DB_NAME)
        .collection("users");
    // const email = credentials?.email;
    // if (!email) {
    //     throw new Error("Email is required.");
    // }
    const fullName = credentials?.username;
    const user = await usersCollection.findOne({fullName});
    // console.log(fullName, user);
    if (!user) {
        throw new Error("User does not exist.");
    }

    const passwordIsValid = await bcrypt.compare(
        credentials?.password!,
        user.password
    );

    if (!passwordIsValid) {
        throw new Error("Mật khẩu không đúng");
    }

    return extractProperties(user, ["fullName", "role", "balance", "uid", "_id"]);
}

