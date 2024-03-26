import React from 'react';
import TableBody from "./TableBody";

interface TableProps {

};

const TableBodyMemo = React.memo(TableBody);

function Table({}: TableProps) {


    const headerTable = [
        // {
        //     title: "ID",
        //     key: "id"
        // },
        {
            title: "Tên người dùng",
            key: "userId"
        },
        {
            title: "Số tiền",
            key: "amount"
        },
        {
            title: "Đã xác nhận",
            key: "confirmed"
        },
        {
            title: "Số đơn đã mua",
            key: "orders"
        },
        {
            title: "Tổng doanh thu",
            key: "revenue"
        },
        {
            title: "hình thức thanh toán",
            key: "paymentMethod"
        },
        {
            title: "Trạng thái",
            key: "status"
        },
        {
            title: "Action",
            key: "action"
        }
    ]


    return (
        <div className={"p-6 min-h-[calc(100vh-146px)] w-full"}>
            <div className={"flex flex-row justify-between items-center py-4"}>
                <h1 className={"text-2xl font-bold"}>Quản lý nạp tiền</h1>
                {/*<button className={"bg-primary text-white rounded-md px-4 py-2"}>Thêm khách hàng</button>*/}
            </div>
            <div className={"grid grid-cols-1"}>
                <div className={"border rounded-lg border-default-200 bg-gray-100"}>
                    <div className={"px-6 py-4 overflow-hidden "}>
                        <div className={"flex flex-row justify-between items-center"}>
                            Danh sách đơn nạp

                        </div>
                    </div>
                    <div className={"relative overflow-x-auto"}>
                        <div className={"min-w-full inline-block align-middle"}>
                            <div className={"overflow-hidden"}>
                                <table className={"min-w-full divide-y divide-default-200"}>
                                    <thead className={"bg-white"}>
                                    <tr className={"text-start"}>
                                        {headerTable.map((item, index) => (
                                            <th key={index} className={"px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"}>
                                                {item.title}
                                            </th>
                                        ))}
                                    </tr>
                                    </thead>
                                    <TableBodyMemo
                                        keys={headerTable.map(item => item.key)}
                                        page={1}
                                        rowsPerPage={10}
                                        data={[]}
                                    />
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Table;