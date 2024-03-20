import React from 'react';
import {IoArrowBackSharp} from "react-icons/io5";
import {Link} from "@nextui-org/react";

interface RedirectHeaderProps {
    redirectUrl: string;
    title?: string;
};

function RedirectHeader({redirectUrl, title}: RedirectHeaderProps) {
    return (
        <div className={"flex flex-row justify-start items-center w-full py-5 fixed z-[999] bg-white"}>
            <div className={"flex justify-center items-center rounded-full p-5 absolute"}>
                <Link href={redirectUrl} color={"warning"}>
                    <IoArrowBackSharp size={30}/>
                </Link>
            </div>
            <div className={"w-full text-center"}>{title}</div>
        </div>
    );
}

export default RedirectHeader;