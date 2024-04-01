import React from 'react';
// import {useAdminApi} from "@/hooks/useAdminApi";
import {Button, Image} from "@nextui-org/react";
import store from "@/adminRedux/store";
import {openModal} from "@/adminRedux/action/OpenModal";
import {formatCurrency, formatCurrencyWithDot} from "@/ultis/currency-format";
import {OrderStatus} from "types/order";
import {formatISODate} from "@/ultis/timeFormat.ultis";
import {FiEye} from "react-icons/fi";

interface TableBodyProps {
    page: number;
    rowsPerPage: number;
    keys: string[];
    actions: string[];
    data: any[],
    type: string;
    isShowSelect?: boolean;
    selectedItems?: {
        key: string,
        value: boolean
    }[];
    setSelectedItems?: ({key, value} :{ key: string, value: boolean }) => void;
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

function TableBody({page = 1, rowsPerPage = 10, keys = [], data, actions, type, isShowSelect, selectedItems, setSelectedItems}: TableBodyProps) {
    // console.log(type)
    return (
        <tbody className={'className={"divide-y divide-default-200"}'}>
        {data.map((item, data_index) => (
            <tr className={"border border-gray-200 border-0 border-b-1"} key={"row" + data_index}>
                {isShowSelect && <td className={"px-6 py-4 whitespace-nowrap text-base"}>
                    <input type="checkbox" onChange={() => setSelectedItems(selectedItems[data_index])} checked={selectedItems[data_index].value}/>
                </td>}
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
                            <td key={"td" + index} className={"px-3 py-4 whitespace-nowrap text-base cursor-pointer"}>
                                <Button
                                    className={" px-3 py-1 text-xs font-medium rounded-md bg-blue-500/10 text-blue-500 h-8"}
                                    onClick={() => {
                                        // @ts-ignore
                                        // console.log(item._id as unknown as string, type)
                                        store.dispatch(openModal(item._id as unknown as string, type))
                                    }}
                                >Chỉnh sửa</Button>
                            </td>
                        )
                    }

                    if (key === 'view') {
                        return (
                            <td key={"td" + index} className={"px-3 py-4 whitespace-nowrap text-base cursor-pointer"}>
                                <Button
                                    className={"w-full px-3 py-1 text-xs font-medium rounded-md bg-blue-500/10 text-blue-500 h-8 flex justify-center items-center gap-1"}
                                    onClick={() => {
                                        // @ts-ignore
                                        // console.log(item._id as unknown as string, type)
                                        store.dispatch(openModal(item._id as unknown as string, type))
                                    }}
                                ><FiEye /> Xem</Button>
                            </td>
                        )
                    }

                    if (key === "orderList") {
                        return (
                            <td key={"td" + index} className={"px-3 py-4 whitespace-nowrap "}>
                               <div className={"flex flex-col justify-start items-center"}>
                                   {item[key].map((order, index) => (
                                        <div key={"order"+index} className={"flex flex-row justify-start items-center gap-1 w-full"}>
                                            <span className={"text-base font-semibold line-clamp-2"}>{order.name}</span>
                                            <span className={"text-base"}>x{order.totalOrder}</span>
                                        </div>
                                      ))}
                               </div>
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
                                <span
                                    className={"cursor-pointer hover:text-blue-600 hover:underline"}
                                    onClick={() => {
                                        store.dispatch(openModal(item[key], "user-management"))
                                    }}
                                >{item[key]}</span>
                                {/*{item[key]}*/}
                            </td>
                        )
                    }

                    if (key === "price") {
                        return (
                            <td key={"td" + index} className={"px-3 py-4 whitespace-nowrap text-base font-semibold"}>
                                {formatCurrencyWithDot((item[key]||0).toString())}.000đ
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
                                {formatCurrency((item[key]||0).toString())}đ
                            </td>
                        )
                    }

                    if (key === "discount") {
                        return (
                            <td key={"td" + index} className={"px-3 py-4 whitespace-nowrap text-base "}>
                                {(item[key]||0)}%
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
                        <td key={"td" + index} className={"px-3 py-4 whitespace-break-spaces text-base max-w-xl "}>
                            {actions[index] === 'formatCurrency'
                                ? <span className={"font-semibold"}>{formatCurrency((item[key]||0).toString())}đ</span>
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