import {BankingMethodUpdate} from "@/services/interface.authenticate";
import clientPromise from "@/lib/mongodb";
import {ObjectId} from "mongodb";

export async function updateBankingMethod(bankingData: BankingMethodUpdate, _id: ObjectId) {
    const {bank, accountName, accountNumber} = bankingData;
    const dbClient = await clientPromise;
    const userCollection = dbClient.db(process.env.DB_NAME).collection('users');

    const updateBankingInfo = await userCollection.updateOne({_id: new ObjectId(_id)}, {
        $set: {
            bankingInfo: {
                bank, accountName, accountNumber
            }
        }
    });

    if (!updateBankingInfo) {
        throw new Error("Update banking method failed");
    }

    return updateBankingInfo;
}