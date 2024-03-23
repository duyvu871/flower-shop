"use client";
import React from 'react';
import {tw} from "@/ultis/tailwind.ultis";
import {Spinner} from "@nextui-org/react";
import {useSelector} from "react-redux";
import {RootState} from "@/redux/reducers";

interface LoadingScreenProps {

};

function LoadingScreen({}: LoadingScreenProps) {
    const isLoading = useSelector((state: RootState) => state.loadingScreen.isLoading);
    return (
        <div
            className={tw("fixed w-[100vw] h-[100vh] flex justify-center items-center bg-gray-900 opacity-40 z-[9999]", isLoading ? "hidden" : "")}>
            <Spinner size={"lg"} color={"white"}/>
        </div>
    );
}

export default LoadingScreen;