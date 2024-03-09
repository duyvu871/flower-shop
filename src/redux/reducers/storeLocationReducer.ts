import {SET_STORE_LOCATION, SetStoreLocationAction } from '@/redux/action/setStoreLocation';

type StoreLocationState = {
    currentLocation: SetStoreLocationAction["payload"]
}

const initialState: StoreLocationState = {
    currentLocation: "HoChiMinhCity"
}

const storeLocationReducer = (state = initialState, action: SetStoreLocationAction) => {
    switch(action.type) {
        case SET_STORE_LOCATION:
            return {
                ...state,
                currentLocation: action.payload
            }
        default:
            return state;
    }
}

export default storeLocationReducer;