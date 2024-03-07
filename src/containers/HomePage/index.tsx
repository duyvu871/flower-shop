"use client";
import React from 'react';
import HomeScreen from "@/containers/HomePage/HomeScreen";
import OrderScreen from "@/containers/HomePage/OrderScreen";
import ProfileScreen from "@/containers/HomePage/ProfileScreen";
import SearchScreen from "@/containers/HomePage/SearchScreen";
import {useSelector} from "react-redux";
import {RootState} from "@/redux/reducers";

interface HomePageProps {

};

const screens = {
    home: <HomeScreen />,
    search: <SearchScreen />,
    order: <OrderScreen />,
    profile: <ProfileScreen />
} as const;

function HomePage({}: HomePageProps) {
    const currentScreen = useSelector((state: RootState) => state.screen.currentScreen);
    return (
        <div className={"w-full h-full flex justify-center items-center"}>
            {screens[currentScreen as keyof typeof screens]}
        </div>
    );
}

export default HomePage;