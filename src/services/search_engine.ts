import clientPromise from "@/lib/mongodb";
import {WithId} from "mongodb";

export class SearchEngine {
    // search by field
    async searchByField<T>(
        collectionName: string,
        field: keyof T,
        query: RegExp|string|number,
        projection: (keyof WithId<T>)[] = []
    ): Promise<T[]|null> {
        const client = await clientPromise;
        const db = client.db(process.env.DB_NAME);
        const collection = db.collection(collectionName);
        const cursor = collection.find({[field]: {$regex: query, $options: "i"}});
        return await cursor.project(projection).toArray() as T[] | null;
    }
    // search in database
    async search<T>(
        collectionName: string,
        query: string,
        projection: (keyof WithId<T>)[] = []
    ): Promise<T[]|null> {
        const client = await clientPromise;
        const db = client.db(process.env.DB_NAME);
        const collection = db.collection(collectionName);
        const cursor = collection.find({$text: {$search: query}});
        return await cursor.project(projection).toArray() as T[] | null;
    }
}