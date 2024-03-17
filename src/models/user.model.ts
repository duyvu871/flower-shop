import mongoose, {Document, Model, Schema} from "mongoose";
import {Schema as SchemaType} from "mongoose";
import { CollectionName, DocumentName} from "@/models/enum";
import {UserInterface} from "types/userInterface";

export interface IUserDocument extends Document, UserInterface {}

const UserSchema: SchemaType = new Schema<IUserDocument>({
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    password: { type: String },
    avatar: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], required: true, default: 'user'},
    balance: { type: Number, required: true, default: 1000},
    id_index: { type: Number, required: true },
    uid: { type: String, required: true },
    virtualVolume: { type: Number, required: true , default: 0},
    total_request_withdraw: { type: Number, required: true , default: 0},
    address: { type: String, required: true },
    cart: { type: [String], required: true },
    orderHistory: { type: [String], required: true },
    transactions: { type: [String], required: true },
    actionHistory: { type: [String], required: true },
    withDrawHistory: { type: [String], required: true },
    bankingInfo: {
        bank: { type: String, required: true },
        accountNumber: { type: String, required: true },
        accountName: { type: String, required: true }
    }
}, {
    timestamps: true,
    collection: CollectionName.USER
});

const UserModel: (Model<IUserDocument> | null) = mongoose.model<IUserDocument>(DocumentName.USER, UserSchema);
export default UserModel;
