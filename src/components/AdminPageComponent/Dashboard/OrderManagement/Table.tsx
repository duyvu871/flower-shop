"use client"
import React, {useLayoutEffect} from 'react';
// import TableBody from "./TableBody";
import TableTemplate from "@/components/AdminPageComponent/Dashboard/Table/TableTemplate";
import {UserInterface} from "types/userInterface";
import {useSelector} from "react-redux";
import {RootState} from "@/adminRedux/reducers";
import store from "@/adminRedux/store";
import {updateUsers} from "@/adminRedux/action/userData";
import {setCurrentTable} from "@/adminRedux/action/currentTable";

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
        title: "Action",
        key: "action"
    }
]

function Table({}: TableProps) {

    const [data, setData] = React.useState<Record<string, UserInterface[]>>({});
    const [currentPage, setCurrentPage] = React.useState<number>(1);
    const [totalPage, setTotalPage] = React.useState<number>(1);
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const {currentTable} = useSelector((state: RootState) => state.currentTable);
    useLayoutEffect(() => {
        setIsLoading(true);

        // if (data['user-data'+currentPage]) {
        //     setIsLoading(false);
        //     return;
        // }

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
                onClick: () => {}
            }}
            listTitle={"Danh sách đơn"}
        >

        </TableTemplate>
    );
}

export default Table;