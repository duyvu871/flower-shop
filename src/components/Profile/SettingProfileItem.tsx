import React from 'react';
import {TfiAngleRight} from "react-icons/tfi";

interface SettingProfileItemProps {
    iconStart: React.ReactNode;
    iconEnd?: React.ReactNode;
    title: string|React.ReactNode;
    action: () => void
};

function SettingProfileItem({iconEnd, iconStart, action, title}: SettingProfileItemProps) {
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