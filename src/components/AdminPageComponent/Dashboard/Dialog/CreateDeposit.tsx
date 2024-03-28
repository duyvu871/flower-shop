import React from 'react';
import {Input, Spacer} from "@nextui-org/react";
import {FaUser} from "react-icons/fa";
import store from "@/adminRedux/store";

interface CreateDepositProps {

};

function CreateDeposit({}: CreateDepositProps) {
    const [purchaseAmount, setPurchaseAmount] = React.useState(0);
    const [userId, setUserId] = React.useState<string>("");
    const createDeposit = async () => {
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
        if (response.status === 200) {
            const responseData = await response.json();
            store.dispatch({
                type: "ADD_ITEM",
                payload: {
                   ...responseData.data,
                    confirmed: true,
                }
            });
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
            <button className={"bg-primary text-white rounded-md px-4 py-2"} onClick={createDeposit}>Nạp tiền</button>
        </div>
    );
}

export default CreateDeposit;