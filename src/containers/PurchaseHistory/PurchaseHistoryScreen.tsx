"use client";
import React, {useLayoutEffect} from 'react';
import RedirectHeader from "@/components/RedirectHeader";
import {useOrder} from "@/hooks/useOrder";
import {PurchaseOrderType} from "types/order";
import {Accordion, AccordionItem} from "@nextui-org/react";
import PurchaseHistoryItem from "@/components/Card/PurchaseHistoryItem";
import {useSession} from "next-auth/react";
import {formatDate} from "@/ultis/timeFormat.ultis";
import {BiMoneyWithdraw} from "react-icons/bi";
import {formatCurrency} from "@/ultis/currency-format";
import {tw} from "@/ultis/tailwind.ultis";

interface PurchaseHistoryScreenProps {

};

function PurchaseHistoryScreen({}: PurchaseHistoryScreenProps) {
    const session = useSession();
    const {data} = session;
    const {getPurchaseOrders} = useOrder();
    const [purchaseOrders, setPurchaseOrders] = React.useState<PurchaseOrderType[]>([]);

    useLayoutEffect(() => {
        (async() => {
            if (!data?.user) return;
            const orders = await getPurchaseOrders(data.user._id as string);
            if (orders) {
                setPurchaseOrders(orders.data);
            }
        })();
    }, [data]);

    return (
        <div className={"flex flex-col justify-center items-center w-full pb-[90px] pt-[70px]"}>
            <div className={"flex flex-col justify-center items-center w-full"}>
                <Accordion variant="splitted" >
                    {purchaseOrders.map((order, index) => {
                        const {_id, amount, isPaid, createdAt, status} = order;
                        const date = formatDate(new Date(createdAt));
                        const isPending = status === "pending";
                        return (
                            <AccordionItem
                                key={"purchase-history-" + index.toString()}
                                // title={"Mua hàng ngày 20/10/2021"}
                                // subtitle={"Tổng số tiền: 100.000đ"}
                                // aria-label={}
                                className={tw("w-full")}
                                startContent={
                                    <div className={"flex flex-row justify-center items-start gap-2 w-full"}>
                                        <div className={"flex flex-col justify-center items-start gap-2"}>
                                            <div className={"flex flex-row justify-center items-center"}>
                                                {isPending
                                                    ? <BiMoneyWithdraw size={20} className={"text-gray-400"}/>
                                                    : <BiMoneyWithdraw size={20} className={"text-green-500"}/>}
                                                {isPending
                                                    ?
                                                    <p className={"text-gray-400 font-semibold"}>{formatCurrency(amount.toString())}đ</p>
                                                    :
                                                    <p className={"text-green-500 font-semibold"}>+{formatCurrency(amount.toString())}đ</p>}
                                            </div>
                                            <div className={"flex flex-row justify-center items-center gap-2"}>
                                                <p className={"text-gray-500 pl-5 text-xs"}>{date.day}/{date.month}/{date.year} {date.time}</p>
                                                <span className={"flex text-xs gap-1 justify-center items-center"}>
                                                Trạng thái:
                                                    {isPending
                                                        ?
                                                        <p className={"text-warning font-semibold"}>Chờ </p>
                                                        : <p className={"text-green-500  font-semibold"}>Đã hoàn thành</p>}
                                            </span>
                                            </div>
                                        </div>
                                    </div>
                                }
                            >
                                <div className={"flex flex-col justify-center items-start"}>
                                <p>Xin thông báo đến quý khách</p>
                                    <p>Thời gian thực hiện: {date.time} {date.day}/{date.month}/{date.year}</p>
                                    <span>mã giao dịch: </span>
                                    <span className={"flex gap-1"}>Số tiền: <p
                                        className={tw(isPending ? "text-gray-500" : "text-green-500", "font-semibold")}>{formatCurrency(amount.toString())}VND</p></span>
                                    <p>Số dư cuối: </p>
                                    <p>Trạng thái: </p>
                                </div>
                            </AccordionItem>
                        );
                    })}
                </Accordion>
            </div>
        </div>
    );
}

export default PurchaseHistoryScreen;