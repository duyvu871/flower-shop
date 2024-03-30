"use client"
import React, {useEffect, useLayoutEffect} from 'react';
import TableBody from "./TableBody";
import {Pagination} from "@nextui-org/react";
import {tw} from "@/ultis/tailwind.ultis";
// import {UserInterface} from "types/userInterface";
// import {formatCurrency} from "@/ultis/currency-format";
// import store from "@/adminRedux/store";
// import {updateUsers} from "@/adminRedux/action/userData";
// import {RootState} from "@/adminRedux/reducers";
// import {useSelector} from "react-redux";

interface TableProps {
    totalPage: number;
    currentPage: number;
    setCurrentPage: (page: number) => void;
    isLoading;
    headerTable: {
        title: string,
        key: string,
        action?: string
    }[];
    data: any[];
    type: string;
    title: string;
    addNew: {
        title: string,
        onClick: () => void,
        isHidden?: boolean
    };
    listTitle: string;
    isShowSelect?: boolean;
    children: React.ReactNode;
    selectedItems: {
        key: string,
        value: boolean
    }[];
    setSelectedItems: ({key, value}?: {key: string; value: boolean}) => void;
};


function TableTemplate({
                           totalPage,
                           setCurrentPage,
                           currentPage,
                           headerTable,
                           data,
                           isLoading,
                           type,
                           listTitle,
                           title,
                           addNew,
    children,
    isShowSelect = false,
    selectedItems,
    setSelectedItems
}: TableProps) {

    return (
        <div className={"p-6  w-full"}>
            <div className={"flex flex-row justify-between items-center py-4 w-full"}>
                <div className={"w-full"}><h1 className={"text-2xl font-bold"}>{title}</h1></div>
                <div className={"flex flex-row justify-end items-center gap-4 w-full"}>
                    <button className={tw("bg-primary text-white rounded-md px-4 py-2", addNew.isHidden ? "hidden" : "")} onClick={addNew.onClick}>{addNew.title}</button>
                    {children}
                </div>
            </div>
            <div className={"grid grid-cols-1"}>
                <div
                    className={"border rounded-lg border-default-200 bg-gray-100"}>
                    <div
                        className={"px-6 py-4 overflow-hidden flex flex-row justify-between items-center"}>
                        <div
                            className={"flex flex-row justify-between items-center"}>
                            {listTitle}
                        </div>
                        <div className={"flex "}>

                        </div>
                        <Pagination
                            showControls
                            total={totalPage}
                            // initialPage={1}
                            classNames={{
                                forwardIcon: "text-white",
                                item: "bg-white text-black",
                                prev: "bg-white text-black",
                                next: "bg-white text-black",
                                cursor: "bg-blue-500 text-white",
                            }}
                            page={currentPage}
                            onChange={(page) => {
                                // console.log(page);
                                setCurrentPage(page);
                            }}
                        />
                    </div>
                    <div className={"relative overflow-x-auto"}>
                        <div className={"min-w-full inline-block align-middle"}>
                            <div className={"overflow-hidden"}>
                                <table className={"min-w-full divide-y divide-default-200"}>
                                    <thead className={"bg-white "}>
                                        <tr className={"text-start"}>
                                            {[(isShowSelect && {
                                                title: "Select",
                                                key: "selectAll"
                                            }), ...headerTable].map((item, index) => {
                                                if (item.title === "Select") {
                                                    return (
                                                        <th key={index} className={"px-6 py-3 text-xs text-gray-500"}>
                                                            <input type="checkbox" onChange={() => {setSelectedItems()}}/>
                                                        </th>
                                                    )
                                                }
                                                return (
                                                    <th key={index} className={"px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-break-spaces max-w-[200px] min-w-[70px] h-[70px]"}>
                                                        {item.title}
                                                    </th>
                                                )
                                            })}
                                        </tr>
                                    </thead>
                                    {isLoading ? <div>Loading...</div> :  <TableBody
                                        keys={headerTable.map(item => item.key)}
                                        actions={headerTable.map(item => item.action)}
                                        page={currentPage - 1}
                                        rowsPerPage={10}
                                        data={data || []}
                                        type={type}
                                        isShowSelect={isShowSelect}
                                        selectedItems={selectedItems}
                                        setSelectedItems={setSelectedItems}
                                    />}
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TableTemplate;