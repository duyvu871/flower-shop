"use client";
import React, {createContext, useLayoutEffect} from "react";
import {MenuItemType} from "types/order";
import {getCurrentTimeOfDay} from "@/ultis/check-date.ultis";
import {routePaths} from "@/ultis/api-route.ultis";

export interface MenuData {
    menuData: MenuItemType[];
    getMenuData: () => Promise<MenuItemType[]>;
}

export const MenuDataContext = createContext<MenuData>({
    menuData: [],
    getMenuData: async () => []
} as MenuData);

export const MenuDataProvider = ({children}: {children: React.ReactNode}) => {
    const [menuData, setMenuData] = React.useState<MenuItemType[]>([]);

    const getMenuData = async () => {
        const currentSession = getCurrentTimeOfDay().type;
        const response = await fetch(`${routePaths.foodDelivery}?time=${currentSession}`);
        if (response.status === 200) {
            const data = await response.json();
            setMenuData(data);
            return data;
        }
        console.log("MenuDataProvider", "getMenuData", "Failed to get menu data");
        return [];
    }

    useLayoutEffect(() => {
        try {
            getMenuData();
        } catch (e) {
            console.error(e);
        }
    }, []);
    return (
        <MenuDataContext.Provider value={{menuData, getMenuData}}>
            {children}
        </MenuDataContext.Provider>
    );
};