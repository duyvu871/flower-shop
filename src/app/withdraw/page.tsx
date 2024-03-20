import React from 'react';
import WithdrawScreen from "@/containers/Withdraw/WithdrawScreen";
import MobileNavigatorMenu from "@/components/Menu/MobileNavigatorMenu";
import RedirectHeader from "@/components/RedirectHeader";
import ProfileWithdrawHistory from "@/containers/Withdraw/WithdrawHistory";

interface PageProps {

};

function Page({}: PageProps) {
    return (
        <>
            <MobileNavigatorMenu isShow={true}/>
            <RedirectHeader redirectUrl={"/profile"} title={"Rút tiền"}/>
            <WithdrawScreen />
            <ProfileWithdrawHistory />
        </>
    );
}

export default Page;