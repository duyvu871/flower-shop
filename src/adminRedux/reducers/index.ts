import { combineReducers } from 'redux';
import ModalReducer from "@/adminRedux/reducers/OpenModalReducers";
import userReducer from "@/adminRedux/reducers/userDataReducers";
import currentTableReducer from "@/adminRedux/reducers/currentTableReducers";


const rootReducer = combineReducers({
    modal: ModalReducer,
    users: userReducer,
    currentTable: currentTableReducer
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;