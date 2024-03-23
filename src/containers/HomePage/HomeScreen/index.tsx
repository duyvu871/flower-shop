import "./home_screen.css";
import React, {useEffect, useState} from 'react';
import {tw} from "@/ultis/tailwind.ultis";
import FindPosition from "@/components/SearchContainer/FindPosition";
import MenuOrderList from "@/components/MenuOrder/MenuOrderList";
import SessionMenu from "@/components/SessionMenu";
import {IoLockClosed} from "react-icons/io5";
import {Chip} from "@nextui-org/react";
import {getCurrentTimeOfDay} from "@/ultis/check-date.ultis";
import Image from "next/image";
import ProfileCard from "@/components/Profile/ProfileCard";

interface HomeScreenProps {

};

function HomeScreen({}: HomeScreenProps) {
    const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
    const [isClose, setIsClose] = useState<boolean>(false);
    const [counterState, setCounterState] = useState<"increase"|"decrease">("increase");
    const bannerUrls =  [
        "/example-assets/banners/banner_1.png",
        "/example-assets/banners/banner_2.png",
        "/example-assets/banners/banner_3.png",
        "/example-assets/banners/banner_4.png"
    ];

    useEffect(() => {
        const currentTime = getCurrentTimeOfDay()
        if (currentTime.currentHour >= 23 || currentTime.currentHour < 5) {
            setIsClose(true);
        }
        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => {
                // console.log("prev", prev, "state", counterState);
                if (prev === bannerUrls.length - 1) {
                    setCounterState("decrease");
                    return bannerUrls.length - 2;
                }
                if (prev === 0) {
                    setCounterState("increase");
                    return 1;
                }
                if (counterState === "increase") return (prev + 1) % bannerUrls.length;
                return (prev - 1) % bannerUrls.length;
            });
        }, 3000);
        return () => clearInterval(interval);
    }, [counterState, bannerUrls.length]);


    return (
        <div className={"w-full flex flex-col justify-start items-center pb-[90px]"}>
            {/*<div className={tw("home_screen image-container min-h-[200px]", (currentImageIndex !== 0 ? "fade-in" : ""))}*/}
            {/*     style={{backgroundImage: `url('${bannerUrls[currentImageIndex]}')`}}></div>*/}
            <div className={"w-full h-[200px] overflow-hidden absolute"}>
                <div className={"overflow-hidden relative"}>
                    {bannerUrls.map((url, index) => {
                        return (
                            <div
                                className={tw(
                                    "home_screen w-full h-[200px] image-slider",
                                    index === bannerUrls.length - 1 ? "transition-none" : ""
                                )}
                                style={{
                                    transform: `translateY(${-currentImageIndex*200}px)`,
                                    backgroundImage: `url('${bannerUrls[index]}')`
                                }}
                                key={"banner-" + index}
                            >
                            </div>
                        )
                    })}
                </div>
            </div>
            {/*<FindPosition/>*/}
            <ProfileCard />
            {/*<MenuOrderList/>*/}
            <div
                className={"text-2xl font-bold w-full text-start p-2 mobile:px-10 flex flex-row items-center flex-wrap gap-2"}>
                {/*<span>Món ngon hôm nay</span>*/}
                <Chip className={isClose ? "" : "hidden"}>
                    <div className={"flex flex-row justify-center items-center gap-1 text-gray-50"}>
                        <p>Đã hết thời gian đặt đơn</p>
                        <IoLockClosed/>
                    </div>
                </Chip>
            </div>
            <SessionMenu/>
        </div>
    );
}

export default HomeScreen;