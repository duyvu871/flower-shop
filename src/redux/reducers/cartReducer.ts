import { ADD_TO_CART, REMOVE_FROM_CART, CLEAR_CART } from "@/redux/action/addToCart";
import {MenuItemType} from "types/order";

const initialState = {
    items: [] as MenuItemType[],
    total: 0
}

const cartReducer = (state = initialState, action: {type: string; payload: MenuItemType}) => {
    switch(action.type) {
        case ADD_TO_CART:
            return {
                ...state,
                items: [...state.items, action.payload],
                total: state.total + action.payload.price
            }
        case REMOVE_FROM_CART:
            const newItems = state.items.filter(item => item._id !== action.payload._id);
            const newTotal = newItems.reduce((acc, item) => acc + item.price, 0);
            return {
                ...state,
                items: newItems,
                total: newTotal
            }
        case CLEAR_CART:
            return {
                ...state,
                items: [],
                total: 0
            }
        default:
            return state;
    }
}

export default cartReducer;