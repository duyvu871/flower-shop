import { combineReducers } from 'redux';
import screenReducer from "@/redux/reducers/activeMenuFeature"

const rootReducer = combineReducers({
    screen: screenReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;