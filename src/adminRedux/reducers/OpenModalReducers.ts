// reducer.ts
import { ModalActionTypes, OPEN_MODAL, CLOSE_MODAL} from '@/adminRedux/action/OpenModal';

export interface ModalState {
    isModalOpen?: boolean;
    type?: ModalActionTypes["payload"]["type"];
    _id?: ModalActionTypes["payload"]["_id"];
}

const initialState: ModalState = {
    isModalOpen: false,
    _id: '',
    type: 'user-management',
};

const ModalReducer = (state = initialState, action: ModalActionTypes): ModalState => {
    switch (action.type) {
        case OPEN_MODAL:
            return {
                ...state,
                isModalOpen: true,
                type: action.payload.type,
                _id: action.payload._id,
            };
        case CLOSE_MODAL:
            return {
                ...state,
                isModalOpen: false,
                type: 'user-management',
                _id: '',
            };

        default:
            return state;
    }
};

export default ModalReducer;
