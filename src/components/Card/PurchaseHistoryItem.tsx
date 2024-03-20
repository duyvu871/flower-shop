import React from 'react';
import {AccordionItem} from "@nextui-org/react";
import {BiMoneyWithdraw} from "react-icons/bi";
import {formatCurrency} from "@/ultis/currency-format";
import {PurchaseOrderType} from "types/order";
import {formatDate} from "@/ultis/timeFormat.ultis";

interface PurchaseHistoryItemProps {
    keyValue: string;
    type: "withdraw" | "purchase";
    data: PurchaseOrderType;
};

function PurchaseHistoryItem({
    keyValue, type = "purchase", data
}: PurchaseHistoryItemProps) {
    const {_id, amount, isPaid, createdAt} = data;
    const date = formatDate(new Date(createdAt));
    return (
        <>
            <AccordionItem
                key={keyValue}
                title={"Mua hàng ngày 20/10/2021"}
                subtitle={"Tổng số tiền: 100.000đ"}
                // aria-label={}
                startContent={
                    <div className={"flex flex-row justify-center items-center"}>
                        {type === "withdraw"
                            ? <BiMoneyWithdraw size={20} className={"text-danger"}/>
                            : <BiMoneyWithdraw size={20} className={"text-green-500"}/>}
                        {type === "withdraw"
                            ? <p className={"text-danger font-semibold"}>-{amount}đ</p>
                            : <p className={"text-green-500 font-semibold"}>+{amount}đ</p>}
                        <p>{date.day}/{date.month}/{date.year} {date.time}</p>
                    </div>
                }
            >
                <div className={"flex flex-col justify-center items-center"}>
                    <p>Xin thông báo đến quý khách</p>
                    <p>Thời gian thực hiện: {date.time} {date.day}/{date.month}/{date.year}</p>
                    <span>mã giao dịch: </span>
                    <span>Số tiền: <p>{formatCurrency(amount.toString())}VND</p></span>
                    <p>Số dư cuối: </p>
                    <p>Trạng thái: </p>
                </div>
            </AccordionItem>
        </>
    );
}

export default PurchaseHistoryItem;