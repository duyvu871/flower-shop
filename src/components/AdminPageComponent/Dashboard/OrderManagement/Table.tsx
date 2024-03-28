"use client"
import React, {useEffect, useLayoutEffect} from 'react';
// import TableBody from "./TableBody";
import TableTemplate from "@/components/AdminPageComponent/Dashboard/Table/TableTemplate";
import {UserInterface} from "types/userInterface";
import {useSelector} from "react-redux";
import {RootState} from "@/adminRedux/reducers";
import store from "@/adminRedux/store";
import {updateUsers} from "@/adminRedux/action/userData";
import {setCurrentTable} from "@/adminRedux/action/currentTable";
import {TimeRange, TimeRangeLabel} from "@/ultis/timeFormat.ultis";
import {Button, Select, SelectItem} from "@nextui-org/react";
import Link from "next/link";

interface TableProps {
};

const headerTable = [
    {
        title: "STT",
        key: "index"
    },
    {
        title: "Đơn giá",
        key: "orderVolume"
    },
    {
        title: "Trạng thái",
        key: "status"
    },
    {
        title: "Ghi chú",
        key: "takeNote"
    },
    {
        title: "Địa chỉ",
        key: "location",
        // action: "formatDate"
    },
    {
        title: "Ngày tạo",
        key: "createdAt",
        action: "formatDate"
    },
    {
        title: "Xem chi tiết",
        key: "view"
    }
]

function Table({}: TableProps) {

    const [data, setData] = React.useState<Record<string, UserInterface[]>>({});
    const [currentPage, setCurrentPage] = React.useState<number>(1);
    const [totalPage, setTotalPage] = React.useState<number>(1);
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const {currentTable} = useSelector((state: RootState) => state.currentTable);
    const [range, setRange] = React.useState<keyof typeof TimeRangeLabel>("all");
    const fetchData = async (page: number) => {
        fetch('/api/v1/admin/order/get-order?page=' + currentPage + '&limit=' + 10).then(async (res) => {
            if (res.status !== 200) {
                return;
            }
            const data = await res.json();
            setData((prev) => ({...prev, ['user-data'+currentPage]: data.data}));
            store.dispatch(setCurrentTable(data.data));
            setTotalPage(Math.ceil(data.count / 10));
            setIsLoading(false);
            // window.localStorage.setItem('temp-user-data', JSON.stringify(data.data));
        });
    }

    const generateXLSX = async () => {
        const response = await fetch('/api/v1/admin/finalization/export-order?range='+range)
        const fileBlob = await response.blob()

        // this works and prompts for download
        var link = document.createElement('a')  // once we have the file buffer BLOB from the post request we simply need to send a GET request to retrieve the file data
        link.href = window.URL.createObjectURL(fileBlob)
        link.download = 'thongtindonhang-'+ TimeRange[range] +'.xlsb'
        link.click()
        link.remove();
    }

    useLayoutEffect(() => {
        fetchData(currentPage);
    }, [currentPage]);

    useEffect(() => {
        setIsLoading(true);

        // if (data['user-data'+currentPage]) {
        //     setIsLoading(false);
        //     return;
        // }
        let count = 0;
        const interval = setInterval(() => {
            count++;
            if (currentPage === 1) {
                // if () {
                //     fetchData(currentPage);
                // }
                fetchData(currentPage);
            } else {
                clearInterval(interval);
            }
            console.log(count)
        }, 15000);


        return () => {
            clearInterval(interval);
        }
    }, [currentPage]);

    return (
        <TableTemplate
            headerTable={headerTable}
            totalPage={totalPage}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            isLoading={isLoading}
            data={currentTable}
            type={"order-management"}
            title={"Quản lý đơn hàng"}
            addNew={{
                title: "Tạo đơn",
                onClick: () => {},
                isHidden: true
            }}
            listTitle={"Danh sách đơn"}
        >
            {
                <>
                {/*// <div className={"flex justify-center items-center min-w-44"}>*/}
                    <Select
                        items={Object.keys(TimeRangeLabel).map((key) => ({
                            value: key,
                            label: TimeRangeLabel[key as keyof typeof TimeRangeLabel],
                        }))}
                        selectedKeys={[range]}
                        label="Phạm vi"
                        // placeholder=""
                        className="max-w-xs w-32"
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
                    {/*<Link href={'api/v1/admin/finalization/export-order?range='+range} passHref={true}>*/}
                        <button className={"bg-primary text-white whitespace-nowrap rounded-md px-4 py-2"} onClick={generateXLSX}>
                            Xuất file
                        </button>
                    {/*</Link>*/}
                {/*// </div>*/}
            </>
            }
        </TableTemplate>
    );
}

export default Table;