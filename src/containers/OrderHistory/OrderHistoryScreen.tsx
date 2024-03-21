"use client";
import React, {useLayoutEffect} from 'react';
import {Accordion, AccordionItem} from "@nextui-org/react";
import {formatDate} from "@/ultis/timeFormat.ultis";
import {tw} from "@/ultis/tailwind.ultis";
import {BiMoneyWithdraw} from "react-icons/bi";
import {formatCurrency} from "@/ultis/currency-format";
import {useSession} from "next-auth/react";
import {useOrder} from "@/hooks/useOrder";
import {OrderType, PurchaseOrderType} from "types/order";
// import {useMenuData} from "@/hooks/useMenuData";

interface OrderHistoryScreenProps {

};

function OrderHistoryScreen({}: OrderHistoryScreenProps) {
    const session = useSession();
    const {data} = session;
    // const {getItemByIds} = useMenuData();
    const {getOrders} = useOrder();
    const [orders, setOrders] = React.useState<OrderType[]>([]);

    useLayoutEffect(() => {
        (async() => {
            if (!data?.user) return;
            const orders = await getOrders(data.user._id as string);
            if (orders) {
                setOrders(orders.data);
            }
        })();
    }, [data]);

    return (
        <div className={"flex flex-col justify-center items-center w-full pb-[90px] pt-[70px]"}>
            <div className={"flex flex-col justify-center items-center w-full"}>
                <Accordion variant="splitted">
                    {orders.map((order, index) => {
                        const {_id, orderVolume, orderList, createdAt, status} = order;
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
                                                    : <BiMoneyWithdraw size={20} className={"text-danger"}/>}
                                                {isPending
                                                    ?
                                                    <p className={"text-gray-400 font-semibold"}>{formatCurrency((orderVolume).toString())}đ</p>
                                                    :
                                                    <p className={"text-danger font-semibold"}>-{formatCurrency((orderVolume).toString())}đ</p>}
                                            </div>
                                            <div className={"flex flex-row justify-center items-center gap-2"}>
                                                <p className={"text-gray-500 pl-5 text-xs"}>{date.day}/{date.month}/{date.year} {date.time}</p>
                                                <span className={"flex text-xs gap-1 justify-center items-center"}>
                                                Trạng thái:
                                                    {isPending
                                                        ?
                                                        <p className={"text-warning font-semibold"}>Chờ </p>
                                                        : <p className={"text-green-500  font-semibold"}>Đã hoàn
                                                            thành</p>}
                                            </span>
                                            </div>
                                        </div>
                                    </div>
                                }
                            >
                                <div className={"flex flex-col justify-center items-start"}>
                                    <div className={"flex flex-row justify-center items-center gap-2"}>
                                        <p className={"text-gray-500 font-semibold"}>Tổng số tiền: </p>
                                        <p className={"text-black font-semibold"}>{formatCurrency((orderVolume).toString())}đ</p>
                                    </div>
                                    <div className={"flex flex-col justify-center items-start gap-2"}>
                                        <p className={"text-gray-500 font-semibold"}>Danh sách món ăn: </p>
                                        <div className={"flex flex-col justify-center items-start gap-2"}>
                                            {orderList.map((item, index) => {
                                                console.log(item)
                                                return (
                                                    <span key={"order-item-" + index.toString()}
                                                       className={"text-black font-semibold text-sm flex justify-center items-center gap-1"}>
                                                        -
                                                        <p className={"line-clamp-1"}>
                                                             {
                                                                 // @ts-ignore
                                                                 item.name||"ok"
                                                             }
                                                        </p>
                                                        <p>x{item.totalOrder}</p>
                                                    </span>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </AccordionItem>
                        );
                    })}
                </Accordion>
            </div>
        </div>
    );
}

export default OrderHistoryScreen;