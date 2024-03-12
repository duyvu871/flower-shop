"use client";
import React, {createContext, useLayoutEffect} from "react";
import {MenuItemType} from "types/order";
import {getCurrentTimeOfDay} from "@/ultis/check-date.ultis";
import {routePaths} from "@/ultis/api-route.ultis";
import {MenuListWithPaginate} from "@/lib/order";
import DBConfigs from "@/configs/database.config";

export interface MenuData {
    menuData: MenuItemType[];
    getMenuData: (page: number, limit: number) => Promise<MenuListWithPaginate|null>;
    updateMenuData: (data: MenuItemType[]) => void;
    findItem: (id: string) => MenuItemType|undefined;
    filterItem: (ids: string[]) => MenuItemType[];
}

export const MenuDataContext = createContext<MenuData>({
    menuData: [],
    getMenuData: async (pageStart: number = 1, pageEnd: number = 1) => null,
    updateMenuData: (data: MenuItemType[]) => {},
    findItem: (id: string) => undefined,
    filterItem: (ids: string[]) => []
} as MenuData);

export const MenuDataProvider = ({children}: {children: React.ReactNode}) => {
    const [menuData, setMenuData] = React.useState<MenuItemType[]>([]);
    const updateMenuData = (data: MenuItemType[]) => {
        setMenuData([...menuData, ...data]);
    }
    const findItem = (id: string) => {
        return menuData.find(item => item._id as unknown as string === id);
    }
   const filterItem = (ids: string[]) => {
        return menuData.filter(item => ids.includes(item._id as unknown as string));
   }
    const getMenuData = async (page: number = 1, limit: number = DBConfigs.perPage): Promise<MenuListWithPaginate|null> => {
        const currentSession = getCurrentTimeOfDay().type;
        const response = await fetch(`${routePaths.foodDelivery}?time=${currentSession}&page=${page}&limit=${limit}`);
        if (response.status === 200) {
            const data = await response.json();
            setMenuData(data.data);
            return data;
        }
        console.log("MenuDataProvider", "getMenuData", "Failed to get menu data");
        return null;
    }
    const addToCart = (item: MenuItemType) => {
        const currentSession = getCurrentTimeOfDay().type;

    }
    useLayoutEffect(() => {
        try {
            // getMenuData();
        } catch (e) {
            console.error(e);
        }
    }, []);
    return (
        <MenuDataContext.Provider value={{
            menuData,
            getMenuData,
            updateMenuData,
            findItem,
            filterItem
        }}>
            {children}
        </MenuDataContext.Provider>
    );
};