"use client";
import React, {useEffect} from 'react';
// import {useAdminApi} from "@/hooks/useAdminApi";
import {Button} from "@nextui-org/react";
import store from "@/adminRedux/store";
import {openModal} from "@/adminRedux/action/OpenModal";
import {UserInterface} from "types/userInterface";
import {formatCurrency} from "@/ultis/currency-format";

interface TableBodyProps {
    page: number;
    rowsPerPage: number;
    keys: string[];
    actions: string[];
    data: UserInterface[];
};

function TableBody({page = 0, rowsPerPage = 10, keys = [], data, actions}: TableBodyProps) {

    return (
        <tbody className={'className={"divide-y divide-default-200"}'}>
            {data.map((user, data_index) => (
                <tr className={""} key={"row"+ data_index}>
                    {keys.map((key, index) => {
                        if (key === "index") {
                            return (
                                <td key={"td" + index} className={"px-6 py-4 whitespace-nowrap text-base"}>
                                    {page*rowsPerPage + data_index + 1}
                                </td>
                            )
                        }

                        if (key === "action") {
                            return (
                                <td key={"td" + index} className={"px-6 py-4 whitespace-nowrap text-base"}>
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

                        return (
                            <td key={"td" + index} className={"px-6 py-4 whitespace-nowrap text-base"}>
                            { actions[index] === 'formatCurrency' ? formatCurrency(user[key].toString()) : (user[key] || "N/A")}
                            </td>
                        )
                    })}
                </tr>
            ))}
        </tbody>
    );
}

export default TableBody;