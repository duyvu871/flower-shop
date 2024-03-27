import React from 'react';
// import {useAdminApi} from "@/hooks/useAdminApi";
import {Button, Image} from "@nextui-org/react";
import store from "@/adminRedux/store";
import {openModal} from "@/adminRedux/action/OpenModal";
import {formatCurrency} from "@/ultis/currency-format";
import {OrderStatus} from "types/order";
import {formatISODate} from "@/ultis/timeFormat.ultis";

interface TableBodyProps {
    page: number;
    rowsPerPage: number;
    keys: string[];
    actions: string[];
    data: any[],
    type: string;
};

const GreenBadge = ({children}) => {
    return (
        <span
            className={"px-3 py-1 text-xs font-medium rounded-md bg-green-500/10 text-green-500"}>
            {children}
        </span>
    )
}

const RedBadge = ({children}) => {
    return (
        <span
            className={"px-3 py-1 text-xs font-medium rounded-md bg-red-500/10 text-red-500"}>
            {children}
        </span>
    )
}

const GreyBadge = ({children}) => {
    return (
        <span
            className={"px-3 py-1 text-xs font-medium rounded-md bg-gray-500/10 text-gray-500"}>
            {children}
        </span>
    )

}

function TableBody({page = 1, rowsPerPage = 10, keys = [], data, actions, type}: TableBodyProps) {
    console.log(type)
    return (
        <tbody className={'className={"divide-y divide-default-200"}'}>
        {data.map((item, data_index) => (
            <tr className={""} key={"row" + data_index}>
                {keys.map((key, index) => {
                    if (key === "index") {
                        return (
                            <td key={"td" + index} className={"px-6 py-4 whitespace-nowrap text-base"}>
                                {page * rowsPerPage + data_index + 1}
                            </td>
                        )
                    }

                    if (key === "action") {
                        return (
                            <td key={"td" + index} className={"px-3 py-4 whitespace-nowrap text-base"}>
                                <Button
                                    className={"px-3 py-1 text-xs font-medium rounded-md bg-blue-500/10 text-blue-500 h-8"}
                                    onClick={() => {
                                        // @ts-ignore
                                        // console.log(item._id as unknown as string, type)
                                        store.dispatch(openModal(item._id as unknown as string, type))
                                    }}
                                >Chỉnh sửa</Button>
                            </td>
                        )
                    }

                    if (key === "status") {
                        return (
                            <td key={"td" + index} className={"px-3 py-4 whitespace-nowrap "}>
                                {item[key] === "pending" ?
                                    <GreyBadge>{OrderStatus[item[key]]}</GreyBadge>
                                    : item[key] === "approved"
                                        ? <GreenBadge>{OrderStatus[item[key]]}</GreenBadge>
                                        : <RedBadge>{OrderStatus[item[key]]}</RedBadge>
                                }
                            </td>
                        )
                    }
                    if (key === "isPaid") {
                        return (
                            <td key={"td" + index} className={"px-3 py-4 whitespace-nowrap "}>
                                {item[key]
                                    ? <GreenBadge>Đã thanh toán</GreenBadge>
                                    : <RedBadge>Chưa thanh toán</RedBadge>
                                }
                            </td>
                        )
                    }
                    if (key === "confirmed") {
                        return (
                            <td key={"td" + index} className={"px-3 py-4 whitespace-nowrap "}>
                                {item[key]
                                    ? <GreenBadge>Đã xác nhận</GreenBadge>
                                    : <RedBadge>Chưa xác nhận</RedBadge>
                                }
                            </td>
                        )
                    }

                    if (key === "userId") {
                        return (
                            <td key={"td" + index} className={"px-3 py-4 whitespace-nowrap text-gray-600 "}>
                                <span className={"cursor-pointer hover:text-blue-600 hover:underline"}>{item[key]}</span>
                                {/*{item[key]}*/}
                            </td>
                        )
                    }

                    if (key === "price") {
                        return (
                            <td key={"td" + index} className={"px-3 py-4 whitespace-nowrap text-base font-semibold"}>
                                {formatCurrency(item[key].toString())}.000đ
                            </td>
                        )
                    }

                    if (key === "image") {
                        return (
                            <td key={"td" + index} className={"px-3 py-4 flex justify-center items-center text-base"}>
                                <Image
                                    shadow="sm"
                                    radius="lg"
                                    width="100%"
                                    alt={item[key]}
                                    className="object-cover h-[50px] w-[50px] rounded-lg"
                                    src={item[key]}
                                />
                            </td>
                        )
                    }

                    if (key === 'orderVolume') {
                        return (
                            <td key={"td" + index} className={"px-3 py-4 whitespace-nowrap text-base font-semibold"}>
                                {formatCurrency(item[key].toString())}đ
                            </td>
                        )
                    }

                    if (actions[index] === "formatDate") {
                        return (
                            <td key={"td" + index} className={"px-3 py-4 whitespace-nowrap text-base"}>
                                {formatISODate(item[key])}
                            </td>
                        )
                    }

                    if (actions[index] === "clamp2") {
                        return (
                            <td key={"td" + index} className={"px-3 py-4  text-base line-clamp-2"}>
                                <div className={"line-clamp-2"}>{item[key]}</div>
                            </td>
                        )
                    }


                    return (
                        <td key={"td" + index} className={"px-3 py-4 whitespace-break-spaces text-base max-w-xl"}>
                            {actions[index] === 'formatCurrency'
                                ? <span className={"font-semibold"}>{formatCurrency(item[key].toString())}đ</span>
                                : (item[key])}
                        </td>
                    )
                })}
            </tr>
        ))}
        </tbody>
    );
}

export default TableBody;