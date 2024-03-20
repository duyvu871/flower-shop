import React from 'react';
import MobileNavigatorMenu from "@/components/Menu/MobileNavigatorMenu";
import UserInfoScreen from "@/containers/UserInfo/UserInfoScreen";

interface PageProps {

};

function Page({}: PageProps) {
    return (
        <>
            <MobileNavigatorMenu isShow={true}/>
            <UserInfoScreen />
        </>
    );
}

export default Page;