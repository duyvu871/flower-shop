"use client";
import React, {useEffect} from 'react';
// import {useAdminApi} from "@/hooks/useAdminApi";
import {Button, Link} from "@nextui-org/react";
import store from "@/adminRedux/store";
import {openModal} from "@/adminRedux/action/OpenModal";
import {UserInterface} from "types/userInterface";
import {formatCurrency} from "@/ultis/currency-format";
import {FaSort} from "react-icons/fa";

interface TableBodyProps {
    page: number;
    rowsPerPage: number;
    keys: (keyof UserInterface & any)[];
    actions: string[];
    data: UserInterface[];
    isSorts: {
        key: keyof UserInterface;
        order: "asc"|"desc";
        isSort: boolean;
    }[];
    defaultSort: {
        key: keyof UserInterface;
        order: "asc"|"desc";
    };
    changeSort: (key: keyof UserInterface, order: "asc"|"desc") => void;
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

function TableBody({page = 0, rowsPerPage = 10, keys = [], data = [], actions, isSorts, defaultSort, changeSort}: TableBodyProps) {
    const FaSortClassName = "text-gray-400 cursor-pointer";
    return (
        <tbody className={'className={"divide-y divide-default-200"}'}>
            {data.map((user, data_index) => (
                <tr className={""} key={"row"+ data_index}>
                    {keys.map((key, index) => {
                        if (key === "index") {
                            return (
                                <td key={"td" + index} className={"px-6 py-4 whitespace-nowrap text-base "}>
                                    {page*rowsPerPage + data_index + 1}
                                </td>
                            )
                        }

                        if (key === "action") {
                            return (
                                <td key={"td" + index} className={"px-6 py-4 whitespace-nowrap text-base cursor-pointer"}>
                                    <Button
                                        className={"px-3 py-1 text-xs font-medium rounded-md bg-blue-500/10 text-blue-500 h-8"}
                                        onClick={() => {store.dispatch(openModal(user._id as unknown as string, "user-management"))}}
                                    >Chỉnh sửa</Button>
                                </td>
                            )
                        }

                        if (key === "status") {
                            return (
                                <td key={"td" + index} className={"px-6 py-4 whitespace-nowrap "}>
                                    {user[key]
                                        ? <span
                                            className={"px-3 py-1 text-xs font-medium rounded-md bg-green-500/10 text-green-500"}>
                                            Active
                                        </span>
                                        : <span
                                            className={"px-3 py-1 text-xs font-medium rounded-md bg-red-500/10 text-red-500"}>
                                            Block
                                        </span>
                                    }
                                </td>
                            )
                        }

                        if (key === 'isLoyalCustomer') {
                            return (
                                <td key={"td" + index} className={"px-3 py-4 whitespace-nowrap text-base"}>
                                    {user[key]
                                        ? <GreenBadge>Khách hàng thân thiết</GreenBadge>
                                        : <GreyBadge>Khách hàng mới</GreyBadge>
                                    }
                                </td>
                            )
                        }

                        if (key === 'telegram') {
                            return (
                                <td key={"td" + index} className={"px-6 py-4 whitespace-nowrap text-base w-24"}>
                                    <Link href={user[key] as string} isExternal={true}>{user[key]}</Link>
                                </td>
                            )
                        }

                        return (
                            <td key={"td" + index} className={"px-6 py-4 whitespace-nowrap text-base"}>
                            { actions[index] === 'formatCurrency' ?
                                <span className={"font-semibold"}>
                                 {formatCurrency(user[key].toString())}
                                </span> : <span>{(user[key])}</span>}
                            </td>
                        )
                    })}
                </tr>
            ))}
        </tbody>
    );
}

export default TableBody;