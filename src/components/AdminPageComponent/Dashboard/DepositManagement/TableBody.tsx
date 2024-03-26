import React from 'react';
import {useAdminApi} from "@/hooks/useAdminApi";
import {Button} from "@nextui-org/react";
import store from "@/adminRedux/store";
import {openModal} from "@/adminRedux/action/OpenModal";

interface TableBodyProps {
    page: number;
    rowsPerPage: number;
    keys: string[];
    data: any[]
};

async function TableBody({page = 1, rowsPerPage = 10, keys = [], data}: TableBodyProps) {
    // const {getUserByPagination} = useAdminApi();
    // const data = await getUserByPagination(page, rowsPerPage);
    return (
        <tbody className={'className={"divide-y divide-default-200"}'}>
        {data.map((user, index) => (
            <tr className={""}>
                {keys.map((key, index) => {

                    if (key === "action") {
                        return (
                            <td key={"td" + index} className={"px-6 py-4 whitespace-nowrap text-base"}>
                                <Button
                                    className={"px-3 py-1 text-xs font-medium rounded-md bg-blue-500/10 text-blue-500 h-8"}
                                    // onClick={() => {store.dispatch(openModal(user._id as unknown as string, "user-management"))}}
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
                            {user[key]}
                        </td>
                    )
                })}
            </tr>
        ))}
        </tbody>
    );
}

export default TableBody;