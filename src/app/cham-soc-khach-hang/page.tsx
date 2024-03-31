"use client"
import React, {useEffect} from 'react';
import {useLiveChatWidget} from "@/hooks/useLiveChatWidget";
import MobileNavigatorMenu from "@/components/Menu/MobileNavigatorMenu";
import RedirectHeader from "@/components/RedirectHeader";

interface PageProps {

};

function Page({}: PageProps) {
    const {openWidget} = useLiveChatWidget();
    useEffect(() => {
        openWidget();
    }, []);
    return (
       <>
           <MobileNavigatorMenu isShow={true}/>
           <RedirectHeader redirectUrl={"/"} title={"Chat với tư vấn viên"}/>
       </>
    );
}

export default Page;