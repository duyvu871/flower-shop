// reducer.ts
import { OrderModalActionTypes, OPEN_ORDER_MODAL, CLOSE_ORDER_MODAL, CLOSE_CART_MODAL, OPEN_CART_MODAL } from '@/redux/action/openOrderModal';

interface OrderModalState {
    isOrderModalOpen?: boolean;
    isCartModalOpen?: boolean;
    orderId?: string;
}

const initialState: OrderModalState = {
    isOrderModalOpen: false,
    orderId: '',
};

const orderModalReducer = (state = initialState, action: OrderModalActionTypes): OrderModalState => {
    switch (action.type) {
        case OPEN_ORDER_MODAL:
            return {
                ...state,
                isOrderModalOpen: true,
                orderId: action.payload,
            };
        case CLOSE_ORDER_MODAL:
            return {
                ...state,
                isOrderModalOpen: false,
                orderId: '',
            };
        case OPEN_CART_MODAL:
            return {
                ...state,
                isCartModalOpen: true,
            };
        case CLOSE_CART_MODAL:
            return {
                ...state,
                isCartModalOpen: false,
            };
        default:
            return state;
    }
};

export default orderModalReducer;
