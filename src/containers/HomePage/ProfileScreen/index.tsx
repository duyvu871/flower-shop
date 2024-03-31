"use client";
import React, {useLayoutEffect} from 'react';
import {Avatar, Spinner} from "@nextui-org/react";
import {useUserData} from "@/hooks/useUserData";
import {useSession} from "next-auth/react";
import {useRouter} from "next/navigation";
import {FaMedal} from "react-icons/fa";
import SettingProfile from "@/components/Profile/SettingProfile";
import {tw} from "@/ultis/tailwind.ultis";
import store from "@/redux/store";

interface ProfileScreenProps {

};

function ProfileScreen({}: ProfileScreenProps) {
    const {userData, isLoaded} = useUserData();
    // useLayoutEffect(() => {
    //
    // }, [isLoaded])
    return (
            <div className={"w-full h-full flex flex-col justify-center items-center "}>
                <div
                    className={"w-full h-fit flex flex-row justify-start items-center gap-3 border-[1px] border-gray-200 p-5 pb-8"}>
                    <Avatar
                        showFallback
                        isBordered
                        color="warning"
                        size="lg"
                        // name={userData.fullName}
                        src={userData.avatar}
                        className={"text-white cursor-pointer aspect-square w-[50px] h-[45px]"}
                        // classNames={{
                        //     base: "w-[40px] h-[40px]",
                        // }}
                    />
                    <div className={"flex flex-col justify-center items-start"}>
                        <p className={"font-bold text-md text-gray-700"}>{userData.fullName || "Nguyễn Thị T"}</p>
                        {userData.isLoyalCustomer ?
                            <span
                                className={"flex flex-row justify-center items-center gap-1 bg-gray-200 rounded-full p-1 px-2 text-[10px]"}>
                            Khách hàng thân thiết
                            <FaMedal className={"text-gray-600"}/>
                        </span> : ""}
                        <p className={"text-xs text-gray-400 mt-1"}>{userData.address || "Chưa có thông tin địa chỉ, cập nhập thêm tại thông tin cá nhân"}</p>

                    </div>
                </div>
                <SettingProfile/>
            </div>
    );
}

export default ProfileScreen;