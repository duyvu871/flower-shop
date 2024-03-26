import React from 'react';
import {TbUsers} from "react-icons/tb";
import {CiShoppingCart} from "react-icons/ci";
import {IoBagHandleOutline} from "react-icons/io5";
import {MdAttachMoney} from "react-icons/md";
import CardDataStats from "@/components/AdminPageComponent/Dashboard/CardDataStats";
import {formatCurrency} from "@/ultis/currency-format";

interface AnalystCardsProps {

};

function AnalystCards({}: AnalystCardsProps) {
    const data = [
        {
            title: "Số lượng người dùng",
            value: 1000,
            rate: 10,
            levelUp: true,
            levelDown: false,
            children: <TbUsers className={"text-blue-600"}/>
        },
        {
            title: "Tổng số đơn hàng",
            value: 1000,
            rate: 10,
            levelUp: false,
            levelDown: true,
            children: <CiShoppingCart className={"text-blue-600"}/>
        },
        {
            title: "Tổng số sản phẩm",
            value: 1000,
            rate: 1,
            levelUp: true,
            levelDown: false,
            children: <IoBagHandleOutline className={"text-blue-600"}/>
        },
        {
            title: "Tổng doanh thu",
            value: 1000,
            rate: 10,
            levelUp: false,
            levelDown: true,
            children: <MdAttachMoney className={"text-blue-600"}/>
        }
    ];
    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7">
            {data.map(
                (item, index) =>
                    <CardDataStats
                        key={"CardDataStats" + index}
                        title={item.title}
                        total={formatCurrency(item.value.toString())}
                        rate={item.rate.toString()+"%"}
                        levelUp={item.levelUp}
                        levelDown={item.levelDown}
                        children={item.children}
                    />
            )}
        </div>
    );
}

export default AnalystCards;