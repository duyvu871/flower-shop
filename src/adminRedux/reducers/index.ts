import { combineReducers } from 'redux';
import ModalReducer from "@/adminRedux/reducers/OpenModalReducers";
import userReducer from "@/adminRedux/reducers/userDataReducers";


const rootReducer = combineReducers({
    modal: ModalReducer,
    users: userReducer
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;