"use client";
import React, {useContext, useEffect} from 'react';
// import {MenuDataContext} from "@/contexts/MenuDataContext";
// import Carousel from 'react-multi-carousel';
// import ShopItemCard from "@/components/Card/ShopItemCard";
// import {MenuItemType} from "types/order";
// import InfiniteScroll from "@/components/InfiniteScroll";
// import {Spinner} from "@nextui-org/react";
import MobileSessionMenu from "@/components/SessionMenu/MobileSessionMenu";

interface SessionMenuProps {

};

function SessionMenu({}: SessionMenuProps) {
    // const { getMenuData, updateMenuData} = useContext(MenuDataContext);
    // const [menuData, setMenuData] = React.useState<MenuItemType[]>([]);

    return (
        <MobileSessionMenu/>
    );
}

export default SessionMenu;