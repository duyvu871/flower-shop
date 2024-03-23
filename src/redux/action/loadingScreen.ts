export const LoadingScreenActionTypes = {
    ShowLoadingScreen: "ShowLoadingScreen",
    HideLoadingScreen: "HideLoadingScreen"
}
export type LoadingScreenActionTypes = typeof LoadingScreenActionTypes;
export interface LoadingScreenAction {
    type: string;
    payload: boolean
}

// export function showLoadingScreen(): LoadingScreenAction {
//     return {
//         type: LoadingScreenActionTypes.ShowLoadingScreen,
//         payload: true
//     }
// }
//
// export function hideLoadingScreen(): LoadingScreenAction {
//     return {
//         type: LoadingScreenActionTypes.HideLoadingScreen,
//         payload: false
//     }
// }