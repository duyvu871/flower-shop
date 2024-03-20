import React, {useEffect} from 'react';
import {Avatar} from "@nextui-org/react";
import {useUserData} from "@/hooks/useUserData";
import {formatCurrency} from "@/ultis/currency-format";
import {FaEye, FaEyeSlash, FaMedal} from "react-icons/fa";
import {tw} from "@/ultis/tailwind.ultis";

interface ProfileCardProps {

};

function ProfileCard({}: ProfileCardProps) {
    const {userData} = useUserData();
    const [isShowBalance, setIsShowBalance] = React.useState<boolean>(false);
    const [isNegativeBalance, setIsNegativeBalance] = React.useState<boolean>(false);
    const [isLoyalCustomer, setIsLoyalCustomer] = React.useState<boolean>(false);
    useEffect(() => {
        if (userData.balance < 0) {
            setIsNegativeBalance(true);
        }
        setIsLoyalCustomer(userData.isLoyalCustomer);
    }, [userData]);
    return (
        <div className={"w-full"}>
            <div
                className={"relative mx-auto my-8 sm:left-0 w-[300px] min-h-[250px] h-auto bg-white p-8 border-gray-400 border-[1px] rounded-xl"}>
                <div className={"w-full flex flex-col justify-center items-center gap-3"}>
                    <div className={"w-full flex flex-col justify-center items-center gap-4"}>
                        <Avatar
                            showFallback
                            isBordered
                            color="warning"
                            // size="lg"
                            name={userData.fullName}
                            src={userData.avatar}
                            className={"text-white text-2xl font-bold uppercase cursor-pointer w-20 h-20"}/>
                        <div className={"flex flex-col justify-center items-center gap-2"}>
                            <p className={"font-bold text-xl"}>{userData.fullName || "Nguyễn Thị T"}</p>
                            {isLoyalCustomer ?
                                <span className={"flex flex-row justify-center items-center gap-1 bg-gray-200 rounded-full p-1 px-2 text-xs"}>
                                    Khách hàng thân thiết
                                    <FaMedal className={"text-gray-600"}/>
                                </span> : ""}
                        </div>
                    </div>
                    <div className={"w-[60%] flex flex-col justify-center items-center gap-1"}>
                        <h1 className={"text-md font-semibold"}>{userData.fullName}</h1>
                        <div className={"flex flex-row justify-start items-center gap-2"}>
                            <span onClick={() => setIsShowBalance(!isShowBalance)}>{isShowBalance ?
                                <FaEyeSlash className={"text-xl"}/> : <FaEye className={"text-xl"}/>}</span>
                            <p className={"text-2xl font-bold flex gap-1"}>
                                {isShowBalance ?
                                    <span
                                        className={tw(isNegativeBalance ? "text-red-500" : "text-green-500")}>{formatCurrency(userData.balance.toString()||"1000")}</span>
                                    : <span>******</span>
                                }
                                <span>vnđ</span>
                            </p>
                        </div>
                        <p className={"text-sm text-gray-400"}>Số dư hiện tại</p>
                        {isNegativeBalance ? <span className={"bg-red-500 rounded-full px-2 p-1 text-white text-xs"}>Số dư đang âm</span> : ""}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProfileCard;