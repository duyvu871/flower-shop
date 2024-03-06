import {ObjectId} from "mongodb";
import clientPromise from "@/lib/mongodb";
import {UserPayload} from "@/types/userInterface";
export async function getUserData(_id: ObjectId, sensitiveData: string[] = []) {
    const protectedList =  ['password', ...sensitiveData];
    const dbClient = await clientPromise;
    const userCollection = dbClient.db(process.env.DB_NAME).collection('users');
    return await userCollection.findOne({_id: new ObjectId(_id)}, {
        projection: {
            ...protectedList.reduce((acc, field) => ({...acc, [field]: 0}), {}),
        }
    });
}