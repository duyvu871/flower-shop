import React from 'react';
import {Input, Spacer, Spinner} from "@nextui-org/react";
import {FaUser} from "react-icons/fa";
import store from "@/adminRedux/store";
import {useToast} from "@/hooks/useToast";
import {closeModal} from "@/adminRedux/action/OpenModal";
import {tw} from "@/ultis/tailwind.ultis";

interface CreateDepositProps {

};

function CreateDeposit({}: CreateDepositProps) {
    const {error, success} = useToast();
    const [purchaseAmount, setPurchaseAmount] = React.useState(0);
    const [userId, setUserId] = React.useState<string>("");
    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const validate = () => {
        if (purchaseAmount <= 0) {
            error("Số tiền phải lớn hơn 0");
            return false;
        }
        if (userId === "") {
            error("ID không được để trống");
            return false;
        }
        return true;
    }

    const createDeposit = async () => {
        if (!validate()) return;

        setIsLoading(true);
        const response = await fetch('/api/v1/admin/deposit/create-deposit', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                amount: purchaseAmount,
                items: [],
                _id: userId,
            }),
        });
        setIsLoading(false);
        if (response.status === 200) {
            const responseData = await response.json();
            store.dispatch({
                type: "ADD_ITEM",
                payload: {
                   ...responseData.data,
                    confirmed: true,
                }
            });
            success("Nạp tiền thành công");
            // @ts-ignore
            store.dispatch(closeModal("", "create-deposit"))
        } else {
            const responseData = await response.json();
            error(responseData.message || responseData.error);
        }

    }
    return (
        <div className={"flex flex-col justify-center items-center gap-4"}>
            <Input
                fullWidth
                type="number"
                label="Giá trị"
                placeholder="0.000"
                labelPlacement="outside-left"
                className="w-full"
                // pattern={"[0-9]+"}
                value={purchaseAmount.toString()}
                classNames={{
                    mainWrapper: "w-full outline-none",
                    label: "text-default-400 w-1/6",
                }}
                startContent={
                    <div className="pointer-events-none flex items-center">
                        <span className="text-default-600 text-small">$</span>
                    </div>
                }
                onChange={(e) => setPurchaseAmount(Number(e.target.value))}
            />
            <Input
                fullWidth
                type="text"
                label="ID"
                placeholder="ID người dùng"
                labelPlacement="outside-left"
                className="w-full"
                // pattern={"[0-9]+"}
                value={userId.toString()}
                classNames={{
                    mainWrapper: "w-full outline-none",
                    label: "text-default-400 w-1/6",
                }}
                startContent={
                    <div className="pointer-events-none flex items-center">
                        <span className="text-default-600 text-small">
                            <FaUser />
                        </span>
                    </div>
                }
                onChange={(e) => setUserId(e.target.value)}
            />
            <Spacer y={1}/>
            <button className={"bg-primary text-white rounded-md px-4 py-2 flex justify-center items-center gap-1"}
                    onClick={createDeposit} disabled={isLoading}>
                <Spinner className={tw(!isLoading ? "hidden": "")} size={'sm'} color={"white"}/>
                Nạp tiền
            </button>
        </div>
    );
}

export default CreateDeposit;