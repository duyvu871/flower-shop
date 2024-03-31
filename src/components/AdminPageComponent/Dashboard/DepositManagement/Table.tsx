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
import {Select, SelectItem} from "@nextui-org/react";
import {TimeRange, TimeRangeLabel} from "@/ultis/timeFormat.ultis";
import {openModal} from "@/adminRedux/action/OpenModal";
import {MenuItemType, PurchaseOrderType} from "types/order";
import {ObjectId} from "mongodb";

const defaultTableData: PurchaseOrderType = {
    _id: "" as unknown as ObjectId,
    userId: "",
    amount: 0,
    paymentMethod: "bank",
    isPaid: false,
    createdAt: new Date(),
    confirmed: false,
    updatedAt: new Date(),
    status: "pending",
    items: []
}

interface TableProps {
};

const headerTable = [
    {
        title: "STT",
        key: "index",
        isSort: false
    },
    {
        title: "Mã nguời dùng",
        key: "userId",
        isSort: false
    },
    {
        title: "Số tiền",
        key: "amount",
        action: "formatCurrency",
        isSort: true
    },
    {
        title: "hình thức thanh toán",
        key: "paymentMethod",
        isSort: false
    },
    {
        title: "Trạng thái",
        key: "isPaid",
        isSort: false
    },
    {
        title: "Ngày tạo",
        key: "createdAt",
        action: "formatDate",
        isSort: true
    },
    {
        title: "Đã xác nhận",
        key: "confirmed",
        isSort: false
    },
    {
        title: "Action",
        key: "action",
        isSort: false
    }
]

function Table({}: TableProps) {

    const [data, setData] = React.useState<Record<string, UserInterface[]>>({});
    const [currentPage, setCurrentPage] = React.useState<number>(1);
    const [totalPage, setTotalPage] = React.useState<number>(1);
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const {currentTable} = useSelector((state: RootState) => state.currentTable);
    const [currentSort, setCurrentSort] = React.useState<{ key: keyof MenuItemType, order: "asc" | "desc" }>({
        key: "createdAt" as unknown as keyof MenuItemType,
        order: "desc"
    });

    const [range, setRange] = React.useState<keyof typeof TimeRangeLabel>("all");
    const fetchData = async (page: number) => {
        fetch('/api/v1/admin/deposit/get-deposit?page=' + currentPage + '&limit=' + 10 + "&filterKey=" + currentSort.key + "&filterOrder=" +currentSort.order ).then(async (res) => {
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
        const response = await fetch('/api/v1/admin/finalization/export-purchase?range='+range)
        const fileBlob = await response.blob()

        // this works and prompts for download
        var link = document.createElement('a')  // once we have the file buffer BLOB from the post request we simply need to send a GET request to retrieve the file data
        link.href = window.URL.createObjectURL(fileBlob)
        link.download = 'thongtinnaptien-'+ TimeRange[range] +'.xlsb'
        link.click()
        link.remove();
    }

    useLayoutEffect(() => {
        fetchData(currentPage);
    }, [currentPage, currentSort]);

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
                if (currentPage === 1) {
                    // if () {
                    //     fetchData(currentPage);
                    // }
                    fetchData(currentPage);
                } else {
                    clearInterval(interval);
                }
            }
            console.log(count)
        }, 15000);


        return () => {
            clearInterval(interval);
        }
    }, []);

    return (
        <TableTemplate
            headerTable={headerTable}
            totalPage={totalPage}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            isLoading={isLoading}
            data={currentTable}
            type={"deposit-management"}
            title={"Quản lý nạp tiền"}
            addNew={{
                title: "Nạp tiền",
                onClick: () => {
                    // @ts-ignore
                    store.dispatch(openModal("" as unknown as string, "create-deposit"))
                }
            }}
            selectedItems={[]}
            setSelectedItems={() => {}}
            listTitle={"Danh sách nạp tiền"}
            currentSort={currentSort}
            setCurrentSort={setCurrentSort as any}
            defaultTableData={defaultTableData}
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
                        classNames={{
                            base: "bg-white rounded-xl",
                        }}
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
                </>}
        </TableTemplate>
    );
}

export default Table;