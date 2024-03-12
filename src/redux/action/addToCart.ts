import {MenuItemType} from "types/order";

export const ADD_TO_CART = 'ADD_TO_CART';
export const REMOVE_FROM_CART = 'REMOVE_FROM_CART';
export const CLEAR_CART = 'CLEAR_CART';

export const addToCart = (item: MenuItemType) => {
    return {
        type: ADD_TO_CART,
        payload: item
    }
}

export const removeFromCart = (id: string) => {
    return {
        type: REMOVE_FROM_CART,
        payload: id
    }
}

export const clearCart = () => {
    return {
        type: CLEAR_CART
    }
}