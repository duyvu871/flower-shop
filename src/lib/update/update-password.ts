import { UserPasswordUpdate} from "@/services/interface.authenticate";
import clientPromise from "@/lib/mongodb";
import {ObjectId} from "mongodb";
import bcrypt from "bcrypt";

export async function updatePassword(updatePasswordInfo: UserPasswordUpdate, _id: ObjectId) {
    const {oldPassword, newPassword} = updatePasswordInfo;
    const dbClient = await clientPromise;
    const userCollection = dbClient.db(process.env.DB_NAME).collection('users');
    const user = await userCollection.findOne({_id: new ObjectId(_id)});
    if (!user) {
        throw new Error("User not found");
    }

    if (!bcrypt.compareSync(oldPassword, user.password)) {
        throw new Error("Mật khẩu cũ không đúng");
    }

    const updatePassword = await userCollection.updateOne({_id: new ObjectId(_id)}, {
        $set: {password: bcrypt.hashSync(newPassword, 10)}
    });

    if (!updatePassword) {
        throw new Error("Update update-password failed");
    }
    return updatePassword;
}