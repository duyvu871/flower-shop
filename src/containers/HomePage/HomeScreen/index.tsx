import "./home_screen.css";
import React, {useEffect, useState} from 'react';
import {tw} from "@/ultis/tailwind.ultis";
import FindPosition from "@/components/SearchContainer/FindPosition";
import MenuOrderList from "@/components/MenuOrder/MenuOrderList";
import SessionMenu from "@/components/SessionMenu";
interface HomeScreenProps {

};

function HomeScreen({}: HomeScreenProps) {
    const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
    const bannerUrls =  [
        "/example-assets/banners/banner_1.png",
        "/example-assets/banners/banner_2.png",
        "/example-assets/banners/banner_3.png",
        "/example-assets/banners/banner_4.png"
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => {
                return (prev + 1) % bannerUrls.length;
            });
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className={"w-full flex flex-col justify-start items-center pb-[90px]"}>
            <div className={tw("home_screen image-container min-h-[200px]" , (currentImageIndex !== 0 ? "fade-in" : ""))} style={{backgroundImage: `url('${bannerUrls[currentImageIndex]}')`}}></div>
            <FindPosition/>
            <MenuOrderList/>
            <div className={"text-2xl font-bold w-full text-start p-2 mobile:px-10"}>
                <span>Món ngon hôm nay</span>
            </div>
            <SessionMenu />
        </div>
    );
}

export default HomeScreen;