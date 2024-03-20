import React from 'react';
import MobileNavigatorMenu from "@/components/Menu/MobileNavigatorMenu";
import RedirectHeader from "@/components/RedirectHeader";
import OrderHistoryScreen from "@/containers/OrderHistory/OrderHIstoryScreen";

interface PageProps {

};

function Page({}: PageProps) {
    return (
        <>
            <MobileNavigatorMenu isShow={true}/>
            <RedirectHeader redirectUrl={"/profile"} title={"Lịch sử giao dịch"}/>
            <OrderHistoryScreen />
        </>
    );
}

export default Page;