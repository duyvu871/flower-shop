import React from 'react';
import MobileNavigatorMenu from "@/components/Menu/MobileNavigatorMenu";
import UserInfoScreen from "@/containers/UserInfo/UserInfoScreen";
import RedirectHeader from "@/components/RedirectHeader";

interface PageProps {

};

function Page({}: PageProps) {
    return (
        <>
            <MobileNavigatorMenu isShow={true}/>
            <RedirectHeader redirectUrl={"/profile"} title={"Thông tin cá nhân"}/>
            <UserInfoScreen />
        </>
    );
}

export default Page;