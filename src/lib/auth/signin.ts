import clientPromise from "@/lib/mongodb";
import bcrypt from "bcrypt";
import {extractProperties} from "@/helper/extractProperties";

export async function signIn(credentials:  Record<"username" | "password", string> | undefined) {
    const client = await clientPromise;
    // console.log(credentials);
    const usersCollection = client
        .db(process.env.DB_NAME)
        .collection("users");
    const username = credentials?.username;
    const user = await usersCollection.findOne({username});
    if (!user) {
        throw new Error("User does not exist.");
    }

    const passwordIsValid = await bcrypt.compare(
        credentials?.password!,
        user.password
    );

    if (!passwordIsValid) {
        throw new Error("Invalid credentials");
    }

    return extractProperties(user, ["username", "role", "balance", "uid", "_id"]);
}

