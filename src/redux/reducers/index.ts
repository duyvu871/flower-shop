import { combineReducers } from 'redux';
import screenReducer from "@/redux/reducers/activeMenuFeature"
import storeLocation from "@/redux/reducers/storeLocationReducer"
import cartReducer from "@/redux/reducers/cartReducer";
import orderModalReducer from "@/redux/reducers/openOrderReducer";
import reduceLoadingScreen from "@/redux/reducers/reduceLoadingScreen";

const rootReducer = combineReducers({
    screen: screenReducer,
    storeLocation: storeLocation,
    cart: cartReducer,
    orderModal: orderModalReducer,
    loadingScreen: reduceLoadingScreen
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;