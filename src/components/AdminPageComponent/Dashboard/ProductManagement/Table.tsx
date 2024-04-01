"use client"
import React, {useEffect, useLayoutEffect} from 'react';
// import TableBody from "./TableBody";
import TableTemplate from "@/components/AdminPageComponent/Dashboard/Table/TableTemplate";
import {UserInterface} from "types/userInterface";
import {useSelector} from "react-redux";
import {RootState} from "@/adminRedux/reducers";
import store from "@/adminRedux/store";
// import {updateUsers} from "@/adminRedux/action/userData";
import {setCurrentTable} from "@/adminRedux/action/currentTable";
import {MenuItemType, TranslateMenuType} from "types/order";
import {updateUsers} from "@/adminRedux/action/userData";
import {openModal} from "@/adminRedux/action/OpenModal";
import {useToast} from "@/hooks/useToast";
import {ObjectId} from "mongodb";

const defaultTableData: MenuItemType = {
    _id: "" as unknown as ObjectId,
    name: "",
    price: 0,
    discount: 0,
    total_sold: 0,
    description: "",
    image: "",
    type: "morning-menu",
    address: ""
}

interface TableProps {
type: string;
isRerender: boolean;
isShowSelect: boolean;
};

const headerTable = [
    {
        title: "STT",
        key: "index",
        isSort: false
    },
    {
        title: "Ảnh",
        key: "image",
        isSort: false,
    },
    {
        title: "Tên món",
        key: "name",
        isSort: false
        // action: "formatCurrency"
    },
    {
        title: "Giá",
        key: "price",
        isSort: true
    },
    {
        title: "Giảm giá",
        key: "discount",
        isSort: true
    },
    {
        title: "Đã bán",
        key: "total_sold",
        isSort: true
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

function Table({type, isRerender, isShowSelect}: TableProps) {
    const {error, success} = useToast();
    const [data, setData] = React.useState<MenuItemType[]>();
    const [currentPage, setCurrentPage] = React.useState<number>(1);
    const [totalPage, setTotalPage] = React.useState<number>(1);
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    // const {currentTable} = useSelector((state: RootState) => state.currentTable);
    const [selectedItems, setSelectedItems] = React.useState<{key: string, value: boolean}[]>([]);
    const [toggleValue, setToggleValue] = React.useState<boolean>(false);
    const [currentSort, setCurrentSort] = React.useState<{ key: keyof MenuItemType, order: "asc" | "desc" }>({
        key: "price" as unknown as keyof MenuItemType,
        order: "desc"
    });
    const fetchData = async (page: number) => {
        fetch('/api/v1/admin/product/get-food-delivery?time='+ type +'&page=' + currentPage + '&limit=' + 10 + "&filterKey=" + currentSort.key + "&filterOrder=" +currentSort.order ).then(async (res) => {
            if (res.status !== 200) {
                return;
            }
            const data = await res.json();
            setData(data.data);
            // store.dispatch(setCurrentTable(data.data));
            setTotalPage(Math.ceil(data.count / 10));
            setSelectedItems(data.data.map((item) => {
                return {key: item._id as unknown as string, value: item.isSelect}
            }));
            setIsLoading(false);
            // window.localStorage.setItem('temp-user-data', JSON.stringify(data.data));
        });
    }

    const updateSelect = async (_id: string) => {
        return fetch('/api/v1/admin/product/update-product', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                productId: _id,
                productType: type+'-menu',
                data: {
                    isSelect: !selectedItems.find((item) => item.key === _id)?.value
                }
            })
        }).then(async (res) => {
            const data = await res.json();
            if (res.status !== 200) {
                return ({
                    status: 400,
                    message: "Cập nhật thất bại"
                });
            }
            setIsLoading(false);
            return ({
                status: 200,
                message: "Cập nhật thành công"
            });
        });
    }

    useLayoutEffect(() => {
        fetchData(currentPage);
    }, [currentPage, currentSort]);

    useEffect(() => {
        setIsLoading(true);

        if (data['user-data'+currentPage]) {
            setIsLoading(false);
            return;
        }
        let count = 0;
        const interval = setInterval(() => {
            count++;
            if (currentPage === 1 && isRerender) {
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
            data={data}
            type={"product-management"}
            title={TranslateMenuType[type+"-menu"]}
            addNew={{
                title: "Thêm món",
                onClick: () => {
                    // @ts-ignore
                    store.dispatch(openModal(type+"-menu", "create-product"));
                }
            }}
            listTitle={"Danh sách món ăn"}
            isShowSelect={isShowSelect}
            selectedItems={selectedItems}
            setSelectedItems={async (state) => {
                if (state) {
                    const tempSelected = selectedItems.map((item) => {
                            if (item.key === state.key) {
                                return {...item, value: !state.value}
                            }
                            return item;
                        }
                    )
                    setSelectedItems(tempSelected);
                    console.log(tempSelected);
                    await updateSelect(state.key);
                } else {
                    setToggleValue(!toggleValue);
                    setSelectedItems((prev) => prev.map((item) => {
                            return {...item, value: !toggleValue}
                        }
                    ))
                    await Promise.all(selectedItems.map(async (item) => {
                        await updateSelect(item.key);
                    }));
                }

            }}
            currentSort={currentSort}
            setCurrentSort={setCurrentSort as any}
            defaultTableData={defaultTableData}
        >
            <></>
        </TableTemplate>
    );
}

export default Table;