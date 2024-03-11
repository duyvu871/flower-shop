import React from 'react';
import {signOut} from "next-auth/react";
import {Avatar, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger} from "@nextui-org/react";
import {CiSettings} from "react-icons/ci";
import {TbReport} from "react-icons/tb";
import {RiCustomerService2Line} from "react-icons/ri";
import {FaSignOutAlt} from "react-icons/fa";
import {CgProfile} from "react-icons/cg";

interface AvatarTriggerDropdownProps {
    avatarIcon: React.ReactNode;
    userData: {
        fullName: string;
        email: string;
    };
};

function AvatarTriggerDropdown({
    avatarIcon, userData
}: AvatarTriggerDropdownProps) {
    return (
        <Dropdown placement="bottom-end">
            <DropdownTrigger>
                {avatarIcon}
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile Actions" variant="flat">
                <DropdownItem key="profile" className="h-14 gap-2" showDivider>
                    <p className="font-semibold">Đăng nhập với:</p>
                    <p className="font-semibold">{userData.email}</p>
                </DropdownItem>
                <DropdownItem key="profile" endContent={<CgProfile size={20}/>} href={'/profile'}>
                    Thông tin của tôi
                </DropdownItem>
                <DropdownItem key="analytics" endContent={<TbReport size={20} className={"text-gray-500"}/>} href={"/cart"}>
                    Đơn hàng
                </DropdownItem>
                <DropdownItem key="customer-service"  endContent={<RiCustomerService2Line size={20} className={"text-gray-500"}/>} >
                    Liên hệ cskh
                </DropdownItem>
                <DropdownItem key="settings" showDivider endContent={<CiSettings size={20} />} href={'/settings'}>
                    Cài đặt
                </DropdownItem>
                <DropdownItem
                    key="logout"
                    color="danger"
                    className={"text-danger"}
                    endContent={<FaSignOutAlt />}
                    onClick={() => signOut()}>
                    Đăng xuất
                </DropdownItem>
            </DropdownMenu>
        </Dropdown>
    );
}

export default AvatarTriggerDropdown;