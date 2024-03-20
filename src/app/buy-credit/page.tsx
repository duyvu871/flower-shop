import React from 'react';
import BuyCreditScreen from "@/containers/BuyCredit/BuyCreditScreen";
import MobileNavigatorMenu from "@/components/Menu/MobileNavigatorMenu";
import PurchaseHistoryScreen from "@/containers/PurchaseHistory/PurchaseHistoryScreen";
import RedirectHeader from "@/components/RedirectHeader";

interface PageProps {

};

function Page({}: PageProps) {
    return (
        <>
            <MobileNavigatorMenu isShow={true}/>
            <RedirectHeader redirectUrl={"/profile"} title={"Nạp tiền"}/>
            <BuyCreditScreen />
        </>
    );
}

export default Page;