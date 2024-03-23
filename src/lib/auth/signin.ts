import clientPromise from "@/lib/mongodb";
import bcrypt from "bcrypt";
import {extractProperties} from "@/helpers/extractProperties";

export async function signIn(credentials:  Record< "username" | "password", string> | undefined) {
    const client = await clientPromise;
    // console.log(credentials);
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

