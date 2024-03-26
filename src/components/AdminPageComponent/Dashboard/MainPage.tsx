import React from 'react';
// import CardDataStats from "@/components/AdminPageComponent/Dashboard/CardDataStats";
// import {GoEye} from "react-icons/go";
// import {CiShoppingCart} from "react-icons/ci";
// import {IoBagHandleOutline} from "react-icons/io5";
// import {TbUser, TbUsers} from "react-icons/tb";
// import {MdAttachMoney} from "react-icons/md";
// import {formatCurrency} from "@/ultis/currency-format";
import Categories from "@/components/AdminPageComponent/Dashboard/Categories";
import BestSeller from "@/components/AdminPageComponent/Dashboard/BestSeller";
import AnalystCards from "@/components/AdminPageComponent/Dashboard/AnalystCards";

interface MainPageProps {

};

function MainPage({}: MainPageProps) {


    return (
        <div className={"w-full h-full p-5 flex flex-row justify-start items-start gap-4"}>
           <div className={"p-5 flex flex-col justify-start items-start gap-8 max-w-5xl"}>
                <AnalystCards/>
                <Categories/>
                <BestSeller/>
            </div>
            <div className={""}>

            </div>
        </div>
    );
}

export default MainPage;