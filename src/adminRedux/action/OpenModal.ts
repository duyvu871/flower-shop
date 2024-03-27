
import { Action } from 'redux';

export const OPEN_MODAL = 'OPEN_MODAL';
export const CLOSE_MODAL = 'CLOSE_MODAL';
export interface OpenModalAction extends Action {
    type: typeof OPEN_MODAL;
    payload: {
        _id: string;
        type: "user-management"| "product-management"| "order-management"| "withdrawal-management"| "deposit-management";
    }; // Assuming orderId is of type string
}

export interface CloseModalAction extends Action {
    type: typeof CLOSE_MODAL;
    payload: {
        _id: string;
        type: "user-management"| "product-management"| "order-management"| "withdrawal-management"| "deposit-management";
    }; //
}

export type ModalActionTypes = OpenModalAction | CloseModalAction ;

export const openModal = (_id: string, type: OpenModalAction["payload"]["type"]): OpenModalAction => {
    return {
        type: OPEN_MODAL,
        payload: {
            _id,
            type: type
        }
    }
}
export const closeModal = (_id: string, type: CloseModalAction["payload"]["type"]): CloseModalAction => {
    return {
        type: CLOSE_MODAL,
        payload: {
            _id,
            type: "user-management"
        }
    }
}