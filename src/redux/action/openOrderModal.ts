import { Action } from 'redux';

export const OPEN_ORDER_MODAL = 'OPEN_ORDER_MODAL';
export const CLOSE_ORDER_MODAL = 'CLOSE_ORDER_MODAL';
export interface OpenOrderModalAction extends Action {
    type: typeof OPEN_ORDER_MODAL;
    payload: string; // Assuming orderId is of type string
}

export interface CloseOrderModalAction extends Action {
    type: typeof CLOSE_ORDER_MODAL;
}

export type OrderModalActionTypes = OpenOrderModalAction | CloseOrderModalAction | OpenCartModalAction | CloseCartModalAction;

export const openOrderModal = (orderId: string): OpenOrderModalAction => {
    return {
        type: OPEN_ORDER_MODAL,
        payload: orderId
    }
}

export const closeOrderModal = (): CloseOrderModalAction => {
    return {
        type: CLOSE_ORDER_MODAL
    }
}

export const CLOSE_CART_MODAL = 'CLOSE_CART_MODAL';
export const OPEN_CART_MODAL = 'OPEN_CART_MODAL';
export interface OpenCartModalAction extends Action {
    type: typeof OPEN_CART_MODAL;
}
export interface CloseCartModalAction extends Action {
    type: typeof CLOSE_CART_MODAL;
}
