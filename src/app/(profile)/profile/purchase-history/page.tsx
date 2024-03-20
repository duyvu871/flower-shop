import React from 'react';
import PurchaseHistoryScreen from "@/containers/PurchaseHistory/PurchaseHistoryScreen";
import MobileNavigatorMenu from "@/components/Menu/MobileNavigatorMenu";
import SignUpForm from "@/components/AuthComponent/SignUp";
import RedirectHeader from "@/components/RedirectHeader";

interface PageProps {

};

function Page({}: PageProps) {
    return (
        <>
            <MobileNavigatorMenu isShow={true}/>
            <RedirectHeader redirectUrl={"/profile"} title={"Lịch sử giao dịch"}/>
            <PurchaseHistoryScreen />
        </>
    );
}

export default Page;