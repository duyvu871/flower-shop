import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {RootState} from "@/redux/reducers";
import {changeScreen} from "@/redux/action/activeMenuFeature";
import store from "@/redux/store";
import {tw} from "@/ultis/tailwind.ultis";

export enum TranslateIconName {
    home= "Home",
    search= "Tìm món",
    order= "Đặt món",
    profile= "Tài khoản"
}

type FeatureItemProps = {
    title: keyof typeof TranslateIconName,
    customIcon: React.ReactElement
}

export default function FeatureItem({title, customIcon}: FeatureItemProps) {
    // console.log(title);
    const [isCurrentScreen, setIsCurrentScreen] = useState<boolean>(false);
    const screen = useSelector((state: RootState) => state.screen.currentScreen);
    const handleChangeScreen = (screen: ReturnType<typeof changeScreen>['payload']) => {
        store.dispatch(changeScreen(screen));
    }
    useEffect(() => {
        setIsCurrentScreen(screen === title);
    }, [screen, title]);
    return (
        <div
            className={tw(
                "flex flex-col justify-center items-center w-full h-fit p-2 text-gray-500  border-t-3 border-gray ",
                isCurrentScreen ? "text-orange-600 border-orange-600" : ""
            )}
            onClick={() => handleChangeScreen(title)}
        >
            <div className={"text-center text-3xl"}>{customIcon}</div>
            <div className={"text-center text-sm font-bold capitalize"}>{TranslateIconName[title]}</div>
        </div>
    )
}