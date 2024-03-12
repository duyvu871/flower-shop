// reducer.ts
import { OrderModalActionTypes, OPEN_ORDER_MODAL, CLOSE_ORDER_MODAL } from '@/redux/action/openOrderModal';

interface OrderModalState {
    isOrderModalOpen: boolean;
    orderId: string;
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
        default:
            return state;
    }
};

export default orderModalReducer;
