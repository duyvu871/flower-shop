import {useContext} from "react";
import {MenuDataContext} from "@/contexts/MenuDataContext";

export const useMenuData = () => {
    const context = useContext(MenuDataContext);
    if (!context) {
        throw new Error('useMenuData must be used within a MenuDataProvider');
    }
    return context;
};