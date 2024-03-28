"use client"
import React, {useLayoutEffect} from 'react';
import {TbUsers} from "react-icons/tb";
import {CiShoppingCart} from "react-icons/ci";
import {IoBagHandleOutline} from "react-icons/io5";
import {MdAttachMoney} from "react-icons/md";
import CardDataStats from "@/components/AdminPageComponent/Dashboard/CardDataStats";
import {formatCurrency} from "@/ultis/currency-format";
import {Select, SelectItem, Spinner} from "@nextui-org/react";
import {TimeRangeLabel} from "@/ultis/timeFormat.ultis";

interface AnalystCardsProps {

};

function AnalystCards({}: AnalystCardsProps) {

    const [dataVirtualization, setDataVirtualization] = React.useState<any>({});
    const [data, setData] = React.useState<any>([]);
    const [isLoading, setIsLoading] = React.useState<boolean>(true);
    const [range, setRange] = React.useState<keyof typeof TimeRangeLabel>("week");
    useLayoutEffect(() => {
        if (range === "all") {
            setRange("month");
        }
        (async () => {
            setIsLoading(true);
            const response = await fetch("/api/v1/admin/finalization/virtualization/traffic?range="+range);
            const data = await response.json();
            console.log(data)
            setDataVirtualization(data.data);
            setData([
                {
                    title: "Số lượng người dùng",
                    value: data.data?.user.count || 0,
                    rate: 0,
                    levelUp: true,
                    levelDown: false,
                    children: <TbUsers className={"text-blue-600"}/>
                },
                {
                    title: "Tổng số đơn hàng",
                    value: data.data?.order.value || 0,
                    rate: data.data?.order.rate || 0,
                    levelUp: false,
                    levelDown: true,
                    children: <CiShoppingCart className={"text-blue-600"}/>
                },
                {
                    title: "Tổng số sản phẩm",
                    value: data.data?.menu.count || 0,
                    rate: 0,
                    levelUp: false,
                    levelDown: false,
                    children: <IoBagHandleOutline className={"text-blue-600"}/>
                },
                {
                    title: "Tổng doanh thu",
                    value: data.data?.revenue.value || 0,
                    rate: data.data?.revenue.rate || 0,
                    levelUp: data.data?.revenue.type === "increase",
                    levelDown: !(data.data?.revenue.type === "increase"),
                    children: <MdAttachMoney className={"text-blue-600"}/>
                }
            ]);
            setIsLoading(false);
        })()
    }, [range])

    return (
        <div className="w-full flex flex-col justify-start items-center gap-4">
            <div className={"w-full flex justify-between items-start"}>
                <p className={"text-[24px] font-bold text-center mb-5 text-gray-800 capitalize"}>
                    Thống kê tổng quan
                </p>
                <Select
                    items={Object.keys(TimeRangeLabel).map((key) => ({
                        value: key,
                        label: TimeRangeLabel[key as keyof typeof TimeRangeLabel],
                    }))}
                    selectedKeys={[range]}
                    label="Phạm vi"
                    // placeholder=""
                    className="max-w-xs w-32 "
                    classNames={{
                        base: "bg-white rounded-xl",
                    }}
                    onChange={(e) => {
                        setRange(e.target.value as keyof typeof TimeRangeLabel);
                    }}
                    variant={"bordered"}
                    color={"primary"}
                    showScrollIndicators={true}
                >
                    {
                        (covan) =>
                            <SelectItem key={covan.value} value={covan.value}>{covan.label}</SelectItem>
                    }
                </Select>
            </div>
            <div className={"w-full grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7"}>
                {isLoading ? <Spinner size={"lg"}/> : data.map(
                        (item, index) =>
                            <CardDataStats
                                key={"CardDataStats" + index}
                                title={item.title}
                                total={formatCurrency(item.value.toString())}
                                rate={item.rate.toString()+"%"}
                                levelUp={item.levelUp}
                                levelDown={item.levelDown}
                            >{item.children}
                            </CardDataStats>
                    )}
            </div>
        </div>
    );
}

export default AnalystCards;