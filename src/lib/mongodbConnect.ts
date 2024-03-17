import mongoose, { ConnectOptions } from 'mongoose';

if (!process.env.MONGODB_URI) {
    throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;
const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';

const options: ConnectOptions = {};

let clientPromise: Promise<typeof mongoose>;

if (IS_DEVELOPMENT) {
    let globalWithMongoose = global as typeof globalThis & {
        _mongooseConnectionPromise?: Promise<typeof mongoose>;
    };

    if (!globalWithMongoose._mongooseConnectionPromise) {
        globalWithMongoose._mongooseConnectionPromise = mongoose.connect(uri, options);
    }
    clientPromise = globalWithMongoose._mongooseConnectionPromise;
} else {
    clientPromise = mongoose.connect(uri, options);
}

export default clientPromise;
