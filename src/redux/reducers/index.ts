import { combineReducers } from 'redux';
import screenReducer from "@/redux/reducers/activeMenuFeature"
import storeLocation from "@/redux/reducers/storeLocationReducer"

const rootReducer = combineReducers({
    screen: screenReducer,
    storeLocation: storeLocation,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;