import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {RootState} from "@/redux/reducers";
import {changeScreen} from "@/redux/action/activeMenuFeature";
import store from "@/redux/store";
import {tw} from "@/ultis/tailwind.ultis";
import {useRouter ,usePathname} from "next/navigation";

export enum TranslateIconName {
    home= "Trang chủ",
    search= "Tìm món",
    order= "Đặt món",
    profile= "Tài khoản"
}

type FeatureItemProps = {
    title: keyof typeof TranslateIconName,
    customIcon: React.ReactElement,
    path: string
}

export function FeatureItemMobile({title, customIcon, path}: FeatureItemProps) {
    // console.log(title);
    const [isCurrentScreen, setIsCurrentScreen] = useState<boolean>(false);
    const router = useRouter();
    const pathName = usePathname();
    // const screen = useSelector((state: RootState) => state.screen.currentScreen);
    const handleChangeScreen = (screen: ReturnType<typeof changeScreen>['payload']) => {
        // if (screen === title) return;
        // store.dispatch(changeScreen(screen));
        router.push(path);
    }
    useEffect(() => {
        if ((title === "home" && pathName === "/")) {
            setIsCurrentScreen(true);
        } else {
            setIsCurrentScreen(pathName.split("/")[1].includes(title));
        }

    }, [title, pathName]);
    return (
        <div
            className={tw(
                "flex flex-col justify-center items-center w-full h-fit p-2 text-gray-500 cursor-pointer border-t-3 border-gray hover:bg-gray-100",
                isCurrentScreen ? "text-orange-600 border-orange-600 bg-gray-50" : ""
            )}
            onClick={() => handleChangeScreen(title)}
        >
            <div className={"text-center text-2xl"}>{customIcon}</div>
            <div className={"text-center text-sm font-bold capitalize"}>{TranslateIconName[title]}</div>
        </div>
    )
}

export function FeatureItemDesktop({title, customIcon}: FeatureItemProps) {
    return (
        <div className={tw(
            "flex flex-col justify-center items-center w-full h-full p-2 text-gray-500  border-t-3 border-gray ",
        )}>
            <div className={"text-center text-3xl"}>{customIcon}</div>
            <div className={"text-center text-sm font-bold capitalize"}>{TranslateIconName[title]}</div>
        </div>
    )
}