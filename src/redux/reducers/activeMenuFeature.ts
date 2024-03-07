import {CHANGE_SCREEN, ChangeScreenAction} from "@/redux/action/activeMenuFeature";

type ScreenState = {
    currentScreen: ChangeScreenAction["payload"]
}

const initialState: ScreenState = {
    currentScreen: "home",
}
const screenReducer = (state = initialState, action: ChangeScreenAction) => {
    switch(action.type) {
        case CHANGE_SCREEN:
            return {
                ...state,
                currentScreen: action.payload
            }
        default:
            return state;
    }
}

export default screenReducer;