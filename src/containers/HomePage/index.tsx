"use client";
import React from 'react';
import HomeScreen from "@/containers/HomePage/HomeScreen";
import OrderScreen from "@/containers/HomePage/OrderScreen";
import ProfileScreen from "@/containers/HomePage/ProfileScreen";
import SearchScreen from "@/containers/HomePage/SearchScreen";
import {useSelector} from "react-redux";
import {RootState} from "@/redux/reducers";
import MenuScreen from "@/containers/HomePage/MenuPage";
import OrderModal from "@/components/Modal/OrderModal";
import CartModal from "@/components/Modal/CartModal";

interface HomePageProps {

};

const screens = {
    home: HomeScreen,
    search: SearchScreen,
    order: OrderScreen,
    profile: ProfileScreen,
    menu: MenuScreen
} as const;

function HomePage({}: HomePageProps) {
    // const currentScreen = useSelector((state: RootState) => state.screen.currentScreen);
    return (
        <>
            <HomeScreen />
            <OrderModal />
            <CartModal />
        </>
        // <div className={"w-full h-full flex justify-center items-center"}>
        // </div>
    );
}

export default HomePage;