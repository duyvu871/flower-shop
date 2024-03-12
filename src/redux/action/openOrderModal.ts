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

export type OrderModalActionTypes = OpenOrderModalAction | CloseOrderModalAction;

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