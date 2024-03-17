import mongoose, {Document, Model, Schema} from "mongoose";
import {Schema as SchemaType} from "mongoose";
import { CollectionName, DocumentName} from "@/models/enum";
import {MenuItemType} from "types/order";
import {ObjectId} from "mongodb";

export interface IFoodMenuDocument extends Document, MenuItemType  {
    _id: ObjectId;
    total_sold: number;
    discount: number;
}

const definition = {
    name: {type: String, required: true},
    price: {type: Number, required: true},
    image: {type: String, required: true},
    description: {type: String, required: true},
    total_sold: {type: Number, required: true},
    address: {type: String, required: true},
    discount: {type: Number, required: true},
    menuType: {type: String, required: true, enum: ['morning', 'afternoon', 'evening', 'other']},
    category: {type: String, required: true, enum: ['food', 'drink']}
}
const options = {
    timestamps: true,
    _id: true,
    collection: CollectionName.FOOD_MENU
};

const FoodMenuSchema: SchemaType = new Schema<IFoodMenuDocument>(definition, options);

const FoodMenuModel: (Model<IFoodMenuDocument> | null) = mongoose.model<IFoodMenuDocument>(DocumentName.FOOD_MENU, FoodMenuSchema);
export default FoodMenuModel;