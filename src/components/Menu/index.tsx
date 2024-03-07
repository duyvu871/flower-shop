"use client";
import React from "react";
import useMediaQuery from "@/hooks/useMediaQuery";
import {tw} from "@/ultis/tailwind.ultis";
import MobileNavigatorMenu from "@/components/Menu/MobileNavigatorMenu";

type MenuBarProps = {

}

const MenuComponents = {
    mobile: MobileNavigatorMenu,
    tablet: MobileNavigatorMenu,
    desktop: MobileNavigatorMenu
} as const;


export default function MenuBar({}: MenuBarProps) {
    const isMobile = useMediaQuery(768);
    const isTablet = useMediaQuery(1024);
    const isDesktop = useMediaQuery(1280);

    return (
       MenuComponents[isMobile ? "mobile" : isTablet ? "tablet" : "desktop"]({} as any)
    )

}