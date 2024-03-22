"use client";
import React, {createContext, useLayoutEffect} from "react";
import {MenuItemType} from "types/order";
import {getCurrentTimeOfDay} from "@/ultis/check-date.ultis";
import {routePaths} from "@/ultis/api-route.ultis";
import {GetMenuListType, MenuListWithPaginate} from "@/lib/order";
import DBConfigs from "@/configs/database.config";

export type CartItemType = MenuItemType & {
    totalOrder: number;
    takeNote: string
};

export type AllMenuType = {
    morning: GetMenuListType;
    afternoon: GetMenuListType;
    evening: GetMenuListType;
    other: GetMenuListType;
}

export interface MenuData {
    menuData: MenuItemType[];
    cart: CartItemType[];
    getMenuData: (page: number, limit: number, time: string) => Promise<MenuListWithPaginate|null>;
    updateMenuData: (data: MenuItemType[]) => void;
    findItem: (id: string) => MenuItemType|undefined;
    filterItem: (ids: string[]) => MenuItemType[];
    addToCart: (item: MenuItemType, totalOrder: number, takeNote: string) => void;
    removeFromCart: (id: string) => void;
    clearCart: () => void;
    updateCart: (cart: CartItemType[]) => void;
    payTheBill: () => void;
    allMenuType: AllMenuType;
    updateAllMenuType: (data: AllMenuType) => void;
    getAllTypeMenu: () => Promise<AllMenuType|null>;
    searchItem: (search: string) => Promise<Record<string, MenuItemType[]>|null>;
    getItemById: (id: string[]) => Promise<MenuItemType[]|null>;
    storeItemToLocalStorage: (data: MenuItemType) => void;
    getStoreItemFromLocalStorage: () => MenuItemType[];
}

const MenuListResponseDefault: GetMenuListType = {
    data: [],
    count: 0,
    page: 1,
    limit: 0,
    perPage: 0
};

export const AllMenuTypeDefault: AllMenuType = {
    morning: MenuListResponseDefault,
    afternoon: MenuListResponseDefault,
    evening: MenuListResponseDefault,
    other: MenuListResponseDefault
}

export const MenuDataContext = createContext<MenuData>({
    menuData: [],
    cart: [],
    allMenuType: {
        morning: {} as GetMenuListType,
        afternoon: {} as GetMenuListType,
        evening: {} as GetMenuListType,
        other: {} as GetMenuListType
    },
    getMenuData: async (page: number = 1, limit: number = 1, time: string) => null,
    updateMenuData: (data: MenuItemType[]) => {},
    findItem: (id: string) => undefined,
    filterItem: (ids: string[]) => [],
    addToCart: (item: MenuItemType, totalOrder, takeNote) => {},
    removeFromCart: (id: string) => {},
    clearCart: () => {},
    updateCart: (cart: CartItemType[]) => {},
    payTheBill: () => {},
    updateAllMenuType: (data: AllMenuType) => {},
    getAllTypeMenu: async () => null,
    searchItem: async (search: string) => null,
    getItemById: async (id: string[]) => null,
    storeItemToLocalStorage: (data: MenuItemType) => {},
    getStoreItemFromLocalStorage: () => []
} as MenuData);

export const MenuDataProvider = ({children}: {children: React.ReactNode}) => {
    const [menuData, setMenuData] = React.useState<MenuItemType[]>([]);
    const [cart, setCart] = React.useState<CartItemType[]>([]);
    const [allMenuType, setAllMenuType] = React.useState<AllMenuType>(AllMenuTypeDefault);

    const storeItemToLocalStorage = (data: MenuItemType) => {
        const storeItem = JSON.parse(localStorage.getItem("store-menu"));
        if (storeItem) {
            const neededStore = storeItem.find((item: MenuItemType) => item._id as unknown as string === data._id as unknown as string);
            if (neededStore) return;
            localStorage.setItem("store-menu", JSON.stringify([...storeItem, data]));
            return;
        }
        localStorage.setItem("store-menu", JSON.stringify([data]));
        return;
    }

    const getStoreItemFromLocalStorage = () => {
        const storeItem = JSON.parse(localStorage.getItem("store-menu"));
        if (storeItem) return storeItem;
        return [];
    }

    const getItemById = async (id: string[]) => {
        // console.log("MenuDataProvider", "getItemByIs", id)

        const response = await fetch(routePaths.searchById + `?ids=${id.join(",")}`);
        if (response.status === 200) {
            return await response.json() as MenuItemType[];
        }
        console.log("MenuDataProvider", "getItemByIs", "Failed to get menu data");
        return null;
    }
    const searchItem = async (search: string) => {
        const response = await fetch(routePaths.searchFood + `?search=${search}`);
        if (response.status === 200) {
            return await response.json() as Record<string, MenuItemType[]>;
        }
        console.log("MenuDataProvider", "searchItem", "Failed to get menu data");
        return null;
    }

    const updateAllMenuType = (data: AllMenuType) => {
        setAllMenuType(data);
    }
    const updateMenuData = (data: MenuItemType[]) => {
        setMenuData(data);
    }
    const findItem = (id: string) => {
        const morning = allMenuType.morning.data.find(item => item._id as unknown as string === id);
        if (morning) return morning as MenuItemType;
        const afternoon = allMenuType.afternoon.data.find(item => item._id as unknown as string === id);
        if (afternoon) return afternoon as MenuItemType;
        const evening = allMenuType.evening.data.find(item => item._id as unknown as string === id);
        if (evening) return evening as MenuItemType;
        const other = allMenuType.other.data.find(item => item._id as unknown as string === id);
        if (other) return other as MenuItemType;
        const storeItem = getStoreItemFromLocalStorage().find((item: MenuItemType) => item._id as unknown as string === id);
        if (storeItem) return storeItem as MenuItemType;
        return undefined;
    }
   const filterItem = (ids: string[]) => {
        return menuData.filter(item => ids.includes(item._id as unknown as string));
   }
    const getMenuData = async (page: number = 1, limit: number = DBConfigs.perPage, time: string): Promise<MenuListWithPaginate|null> => {
        // const currentSession = getCurrentTimeOfDay().type;
        const response = await fetch(`${routePaths.foodDelivery}?time=${time}&page=${page}&limit=${limit}`);
        if (response.status === 200) {
            const data = await response.json();
            setMenuData(data.data);
            return data;
        }
        console.log("MenuDataProvider", "getMenuData", "Failed to get menu data");
        return null;
    }
    const getAllTypeMenu = async () => {
        const response = await fetch(routePaths.allMenu);
        if (response.status === 200) {
            const data = await response.json() as AllMenuType;
            setAllMenuType(data);
            return data;
        }
        console.log("MenuDataProvider", "getAllTypeMenu", "Failed to get menu data");
        return null;
    }

    const addToCart = (item: MenuItemType, totalOrder: number, takeNote: string) => {
        const currentSession = getCurrentTimeOfDay().type;
        const cartData = localStorage.getItem(`cart-${currentSession}`);
        const cartItem = {...item, totalOrder, takeNote};
        if (cartData) {
            const cart: CartItemType[] = JSON.parse(cartData);
            const filteredCart = cart.find((item: CartItemType) => item._id as unknown as string === cartItem._id as unknown as string);
            if (filteredCart) {
                const newCart = cart.map((item: CartItemType) => {
                    if (item._id as unknown as string === cartItem._id as unknown as string) {
                        return {...cartItem, totalOrder: item.totalOrder + totalOrder, takeNote: takeNote};
                    }
                    return item;
                });
                localStorage.setItem(`cart-${currentSession}`, JSON.stringify(newCart));
                setCart(newCart);
                return;
            }
            localStorage.setItem(`cart-${currentSession}`, JSON.stringify([...cart, cartItem]));
            setCart([...cart, cartItem]);
            return;
        } else {
            localStorage.setItem(`cart-${currentSession}`, JSON.stringify([{...cartItem}]));
            setCart([{...cartItem}]);
            return;
        }
    }

    const updateCart = (cart: CartItemType[]) => {
        const currentSession = getCurrentTimeOfDay().type;
        localStorage.setItem(`cart-${currentSession}`, JSON.stringify(cart));
        setCart(cart);
    }
    const removeFromCart = (id: string) => {
        const currentSession = getCurrentTimeOfDay().type;
        const cartData = localStorage.getItem(`cart-${currentSession}`);
        if (cartData) {
            const cart = JSON.parse(cartData);
            const newCart = cart.filter((item: CartItemType) => item._id as unknown as string !== id);
            localStorage.setItem(`cart-${currentSession}`, JSON.stringify(newCart));
            setCart(newCart);
        }
    }
    const clearCart = () => {
        const currentSession = getCurrentTimeOfDay().type;
        localStorage.removeItem(`cart-${currentSession}`);
        setCart([]);
    }

    const payTheBill = () => {

    }

    useLayoutEffect(() => {
        try {
            // getMenuData();
            const currentSession = getCurrentTimeOfDay().type;
            const cartData = localStorage.getItem("cart-" + currentSession);
            if (cartData) {
                setCart(JSON.parse(cartData));
            }
        } catch (e) {
            console.error(e);
        }
    }, []);
    return (
        <MenuDataContext.Provider value={{
            storeItemToLocalStorage,
            getStoreItemFromLocalStorage,
            getAllTypeMenu,
            updateAllMenuType,
            allMenuType,
            payTheBill,
            updateCart,
            cart,
            removeFromCart,
            clearCart,
            addToCart,
            menuData,
            getMenuData,
            updateMenuData,
            findItem,
            filterItem,
            searchItem,
            getItemById
        }}>
            {children}
        </MenuDataContext.Provider>
    );
};