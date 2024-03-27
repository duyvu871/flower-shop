"use client"
import React, {useLayoutEffect} from 'react';
// import TableBody from "./TableBody";
import TableTemplate from "@/components/AdminPageComponent/Dashboard/Table/TableTemplate";
import {UserInterface} from "types/userInterface";
import {useSelector} from "react-redux";
import {RootState} from "@/adminRedux/reducers";
import store from "@/adminRedux/store";
// import {updateUsers} from "@/adminRedux/action/userData";
import {setCurrentTable} from "@/adminRedux/action/currentTable";
import {MenuItemType} from "types/order";



interface TableProps {
type: string
};

const headerTable = [
    {
        title: "STT",
        key: "index"
    },
    {
        title: "Ảnh",
        key: "image"
    },
    {
        title: "Tên món",
        key: "name",
        // action: "formatCurrency"
    },
    {
        title: "Giá",
        key: "price",
    },
    {
        title: "Giảm giá",
        key: "discount",
    },
    {
        title: "Đã bán",
        key: "total_sold"
    },
    {
        title: "Mô tả",
        key: "description",
        // action: "formatDate"
    },
    {
        title: "Action",
        key: "action"
    }
]

function Table({type}: TableProps) {

    const [data, setData] = React.useState<MenuItemType[]>();
    const [currentPage, setCurrentPage] = React.useState<number>(1);
    const [totalPage, setTotalPage] = React.useState<number>(1);
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    // const {currentTable} = useSelector((state: RootState) => state.currentTable);
    useLayoutEffect(() => {
        setIsLoading(true);

        // if (data['user-data'+currentPage]) {
        //     setIsLoading(false);
        //     return;
        // }

        fetch('/api/v1/info/get-food-delivery?time='+ type +'&page=' + currentPage + '&limit=' + 10).then(async (res) => {
            if (res.status !== 200) {
                return;
            }
            const data = await res.json();
            setData(data.data);
            // store.dispatch(setCurrentTable(data.data));
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
            data={data}
            type={"product-management"}
            title={"Quản lý món"}
            addNew={{
                title: "Thêm món",
                onClick: () => {}
            }}
            listTitle={"Danh sách món ăn"}
        >

        </TableTemplate>
    );
}

export default Table;