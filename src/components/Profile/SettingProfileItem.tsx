import React from 'react';
import {TfiAngleRight} from "react-icons/tfi";
import {Link} from "@nextui-org/react";

interface SettingProfileItemProps {
    iconStart: React.ReactNode;
    iconEnd?: React.ReactNode;
    title: string|React.ReactNode;
    action: () => any;
    type?: "action"|"link";
};

function SettingProfileItem({iconEnd, iconStart, action, title, type}: SettingProfileItemProps) {
    if (type === "link") {
        return (
            <Link className={"w-full flex flex-row items-center justify-between border-b-[1px] border-gray-200 py-4 pr-5 cursor-pointer"}
                href={action() as string}
                isExternal={true}
            >
                <div className={"flex flex-row items-center justify-center gap-2"}>
                    {iconStart}
                    <p className={"text-md font-medium text-gray-500"}>{title}</p>
                </div>
                <div className={"flex flex-row justify-center items-center gap-1"}>
                    {iconEnd|| <TfiAngleRight className={"text-gray-700"}/>}
                </div>
            </Link>
        );
    }
    return (
        <div className={"w-full flex flex-row items-center justify-between border-b-[1px] border-gray-200 py-4 pr-5 cursor-pointer"} onClick={action}>
            <div className={"flex flex-row items-center justify-center gap-2"}>
                {iconStart}
                <p className={"text-md font-medium text-gray-500"}>{title}</p>
            </div>
            <div className={"flex flex-row justify-center items-center gap-1"}>
                {iconEnd|| <TfiAngleRight className={"text-gray-700"}/>}
            </div>
        </div>
    );
}

export default SettingProfileItem;