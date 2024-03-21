import clientPromise from "@/lib/mongodb";
import {Document, FindCursor, ObjectId, WithId} from "mongodb";

export class SearchEngine {
    // search by field
    public static async searchByField<T>(
        collectionName: string,
        field: keyof T,
        query: RegExp | string | number,
        projection: (keyof WithId<T>)[] = []
    ): Promise<T[] | null> {
        const client = await clientPromise;
        const db = client.db(process.env.DB_NAME);
        const collection = db.collection(collectionName);
        let cursor: FindCursor<WithId<Document>>;
        if (field === "_id") {
            cursor = collection.find({_id: new ObjectId(query as string)});
            return await cursor.project(projection).toArray() as T[] | null;
        }
        cursor = collection.find({[field]: {$regex: query, $options: "i"}});
        return await cursor.project(projection).toArray() as T[] | null;
    }
    // search in database
    public static async search<T>(
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
    public static async searchInManyCollection<T>(
        collectionNames: string[],
        field: keyof T,
        query: string,
        projection: (keyof WithId<T>)[] = []
    ): Promise<Record<typeof collectionNames[number], T[]>> {
        const client = await clientPromise;
        const db = client.db(process.env.DB_NAME);
        const regex = new RegExp(["", query.split(" ").map(item => `(?=.*${item})`).join("|"), ""].join(""), "i");
        const pipeline: any[] = [
            {
                $match: {
                    [field]: {
                        $regex: regex
                    }
                }
            },
            {
                $project: {
                    ...projection.reduce((acc, cur) => ({...acc, [cur]: 1}), {}),
                }
            },
        ];

        const matchedCollections: Record<typeof collectionNames[number], T[]> = {};
        for (const collectionName of collectionNames) {
            const cursor = db.collection(collectionName).aggregate(pipeline);
            const result = await cursor.toArray() as T[] | null;
            if (result) {
                matchedCollections[collectionName] = result;
            }
        }

        return matchedCollections;
    }

}