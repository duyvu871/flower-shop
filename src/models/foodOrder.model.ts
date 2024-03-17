import mongoose, {Document, Model, Schema} from "mongoose";
import {Schema as SchemaType} from "mongoose";
import {ObjectId} from "mongodb";
import {MenuItemType} from "types/order";
import {CollectionName, DocumentName} from "@/models/enum";

export interface IFoodOrderDocument extends Document {
    _id: ObjectId;
    owner: ObjectId;
    menuItem: ObjectId;
    takeNote: string;
    totalOrder: number;
}

const FoodOrderSchema: SchemaType = new Schema<IFoodOrderDocument>({
    menuItem: {type: Schema.Types.ObjectId, ref: 'foodMenu', required: true},
    owner: {type: Schema.Types.ObjectId, ref: 'users'},
    takeNote: {type: String, required: false},
    totalOrder: {type: Number, required: true, default: 1},
}, {
    timestamps: true,
    _id: true,
    collection: CollectionName.FOOD_ORDER
});

const FoodOrderModel: (Model<IFoodOrderDocument> | null) = mongoose.model<IFoodOrderDocument>(DocumentName.FOOD_ORDER, FoodOrderSchema);

export default FoodOrderModel;