import { combineReducers } from 'redux';
import screenReducer from "@/redux/reducers/activeMenuFeature"
import storeLocation from "@/redux/reducers/storeLocationReducer"
import cartReducer from "@/redux/reducers/cartReducer";
import orderModalReducer from "@/redux/reducers/openOrderReducer";

const rootReducer = combineReducers({
    screen: screenReducer,
    storeLocation: storeLocation,
    cart: cartReducer,
    orderModal: orderModalReducer
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;