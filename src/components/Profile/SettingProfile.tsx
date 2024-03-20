import React from 'react';
import SettingProfileItem from "@/components/Profile/SettingProfileItem";
import {TbClockDollar} from "react-icons/tb";
import {CgNotes, CgProfile} from "react-icons/cg";
import {TfiAngleRight} from "react-icons/tfi";
import {RiBankCardFill, RiCustomerService2Line} from "react-icons/ri";
import {useRouter} from "next/navigation";
import {PiSignOutBold} from "react-icons/pi";
import {signOut} from "next-auth/react";
import {HiOutlineBanknotes} from "react-icons/hi2";

interface SettingProfileProps {

};

function SettingProfile({}: SettingProfileProps) {
    const {push} = useRouter();
    const handler = [
        {
            iconStart: <HiOutlineBanknotes size={25} className={"text-green-500"}/>,
            title: "Nạp tiền",
            action: () => {push("/buy-credit")}
        },
        {
            iconStart: <RiBankCardFill size={25} className={"text-green-500"}/>,
            title: "Rút tiền",
            action: () => {push("/withdraw")}
        },
        {
            iconStart: <TbClockDollar size={25} className={"text-green-500"}/>,
            title: "Đơn nạp tiền",
            action: () => {push("/profile/purchase-history")}
        },
        {
            iconStart: <CgNotes size={25} className={"text-blue-400"} />,
            title: "Đơn mua",
            iconEnd: <>
                <p className={"text-xs text-gray-400"}>Xem lịch sử đặt món</p>
                <TfiAngleRight />
            </>,
            action: () => {push("/profile/order-history")}
        },
        {
            iconStart: <CgProfile size={25}/>,
            title: "Thông tin cá nhân",
            action: () => {push("/profile/thong-tin-ca-nhan")}
        },
        {
            iconStart: <RiCustomerService2Line size={25} />,
            title: "Liên hệ cskh",
            action: () => {}
        },
        {
            iconStart: <PiSignOutBold size={25} className={"text-red-500"}/>,
            title: <span className={"text-red-500"}>Đăng xuất</span>,
            action: () => {
                const isConfirm = confirm("Bạn có chắc chắn muốn đăng xuất?");
                if (isConfirm) {
                    signOut().then(() => {
                        push("/");
                    });
                }
            },
            iconEnd: <></>
        }
    ]
    return (
        <div className={"w-full flex flex-col justify-center items-center gap-2 pl-5"}>
            {handler.map((item, index) => (
                <SettingProfileItem
                    key={index}
                    iconStart={item.iconStart}
                    iconEnd={item.iconEnd}
                    title={item.title}
                    action={item.action}
                />
            ))}
        </div>
    );
}

export default SettingProfile;