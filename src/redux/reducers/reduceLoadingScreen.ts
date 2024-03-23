import {LoadingScreenAction, LoadingScreenActionTypes} from "@/redux/action/loadingScreen";

type ScreenState = {
    isLoading: LoadingScreenAction["payload"]
}

const initialState: ScreenState = {
    isLoading: false
}
const reduceLoadingScreen = (state = initialState, action: LoadingScreenAction) => {
    switch(action.type) {
        case LoadingScreenActionTypes.ShowLoadingScreen:
            return {
                ...state,
                isLoading: true
            }
        case LoadingScreenActionTypes.HideLoadingScreen:
            return {
                ...state,
                isLoading: false
            }
        default:
            return state;
    }
}
export default reduceLoadingScreen;