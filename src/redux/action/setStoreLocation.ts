import StoreLocation from "@/ultis/location.ultis";

export const SET_STORE_LOCATION = "SET_STORE_LOCATION";

export const setStoreLocation = (location: keyof typeof StoreLocation) => {
    return {
        type: SET_STORE_LOCATION,
        payload: location
    }
}

export type SetStoreLocationAction = ReturnType<typeof setStoreLocation>;