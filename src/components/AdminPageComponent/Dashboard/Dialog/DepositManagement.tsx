import React, {useEffect} from 'react';
import {Button, Select, SelectItem} from "@nextui-org/react";
import {useToast} from "@/hooks/useToast";
import store from "@/adminRedux/store";
import {UPDATE_ITEM} from "@/adminRedux/action/currentTable";
import {RootState} from "@/adminRedux/reducers";
import {useSelector} from "react-redux";
import {OrderType, PurchaseOrderType} from "types/order";

interface DepositManagementProps {
_id: string;
};

enum Status {
    isPaid = 'Đã thanh toán',
    isNotPaid = 'Chưa thanh toán',
}

enum confirmStatus {
    isConfirmed = 'Đã xác nhận',
    isNotConfirmed = 'Chưa xác nhận',
}

function DepositManagement({_id}: DepositManagementProps) {
    const currentTable = useSelector((state: RootState) => state.currentTable.currentTable);
    const {error, success} = useToast();
    const [status, setStatus] = React.useState<keyof typeof Status>('isNotPaid');
    const [confirm, setConfirm] = React.useState<keyof typeof confirmStatus>('isNotConfirmed');
    const [isUpdating, setIsUpdating] = React.useState<boolean>(false);
    const [isDeleting, setIsDeleting] = React.useState<boolean>(false);

    const handleSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        //@ts-ignore
        setStatus(e.target.value);
        // console.log(status)
    };
    const handleConfirmSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        //@ts-ignore
        setConfirm(e.target.value);
        // console.log(status)
    }
    const handleUpdate = async () => {
        console.log(status)
        setIsUpdating(true);
        const response = await fetch("/api/v1/admin/deposit/update-deposit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                depositId: _id,
                status: {
                    isPaid: status === 'isPaid',
                    confirmed: confirm === 'isConfirmed',
                },
            }),
        });
        const responseData = await response.json();
        if (response.status === 200) {
            success(responseData.message);
            setIsUpdating(false);
            store.dispatch({
                type: "UPDATE_ITEM",
                payload: {
                    _id,
                    isPaid: status === 'isPaid',
                    confirmed: confirm === 'isConfirmed',
                }
            });
        } else {
            error(responseData.error);
            setIsUpdating(false);
        }
    }

    useEffect(() => {
        const tableItem = currentTable.find(item => item._id === _id) as PurchaseOrderType;
        setStatus(tableItem.isPaid ? 'isPaid' : 'isNotPaid');
        setConfirm(tableItem.confirmed ? 'isConfirmed' : 'isNotConfirmed');
    }, [currentTable]);
    return (
        <div className={"flex flex-col justify-center items-center gap-4"}>
            <div className={"w-full flex flex-col justify-center items-center gap-2 p-4"}>
                <Select
                    items={Object.keys(Status).map((key) => ({
                        value: key,
                        label: Status[key as keyof typeof Status],
                    }))}
                    selectedKeys={[status]}
                    label="Trạng thái"
                    // placeholder=""
                    className="max-w-xs"
                    onChange={handleSelectionChange}
                    variant={"bordered"}
                    color={"primary"}
                    showScrollIndicators={true}
                >
                    {
                        (covan) =>
                            <SelectItem key={covan.value} value={covan.value}>{covan.label}</SelectItem>
                    }
                </Select>
                <Select
                    items={Object.keys(confirmStatus).map((key) => ({
                        value: key,
                        label: confirmStatus[key as keyof typeof confirmStatus],
                    }))}
                    selectedKeys={[confirm]}
                    label="Xác nhận"
                    // placeholder=""
                    className="max-w-xs"
                    onChange={handleConfirmSelectionChange}
                    variant={"bordered"}
                    color={"primary"}
                    showScrollIndicators={true}
                >
                    {
                        (covan) =>
                            <SelectItem key={covan.value} value={covan.value}>{covan.label}</SelectItem>
                    }
                </Select>
            </div>
            <div className={"flex flex-row gap-2"}>
                <Button className={"bg-blue-600 text-white"} disabled={isUpdating} onClick={handleUpdate}>Lưu</Button>
                <Button className={"bg-red-500 text-white"} disabled={isDeleting} onClick={() => {}}>Xóa</Button>
            </div>
        </div>
    );
}

export default DepositManagement;