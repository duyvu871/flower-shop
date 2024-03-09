"use client";
import React, {useEffect} from "react";
import useMediaQuery from "@/hooks/useMediaQuery";
import {tw} from "@/ultis/tailwind.ultis";
import MobileNavigatorMenu from "@/components/Menu/MobileNavigatorMenu";
import DesktopNavigatorMenu from "@/components/Menu/DesktopNavigatorMenu";

type MenuBarProps = {

}

const MenuComponents = {
    mobile: MobileNavigatorMenu,
    tablet: DesktopNavigatorMenu,
    desktop: DesktopNavigatorMenu
} as const;


export default function MenuBar({}: MenuBarProps) {
    const isMobile = useMediaQuery(768);
    const isTablet = useMediaQuery(1024);
    const isDesktop = useMediaQuery(1280);
    useEffect(() => {

    }, [isMobile]);
    return (
       <>
           <MobileNavigatorMenu isShow={isMobile}/>
           <DesktopNavigatorMenu isShow={isMobile}/>
       </>
    )

}