"use client";
import React, {memo, useEffect, useState} from 'react';
import {Accordion, AccordionItem, Button, Checkbox, Input, type Selection, Spinner} from "@nextui-org/react";
import SignUpForm from "@/components/AuthComponent/SignIn";
import {useToast} from "@/hooks/useToast";
import {tw} from "@/ultis/tailwind.ultis";
import PurchaseGuide from "@/components/Guide/PurchaseGuide";
import {currencyToNumber, formatCurrency, } from "@/ultis/currency-format";
// import {isNumber} from "@/ultis/validate.ultis";
import {useOrder} from "@/hooks/useOrder";
import RedirectHeader from "@/components/RedirectHeader";
import {useUserData} from "@/hooks/useUserData";
interface BuyCreditScreenProps {
    
};

const PurchaseGuideMemo = memo(PurchaseGuide);

function BuyCreditScreen({}: BuyCreditScreenProps) {
    const {createPurchaseOrder} = useOrder();
    const {error, success} = useToast();
    const {userData} = useUserData()
    const [selectedTab, setSelectedTab] = useState<Selection>(new Set(['1']));
    const [purchaseAmount, setPurchaseAmount] = useState<number>(0);
    const [isConfirmPurchase, setIsConfirmPurchase] = useState<boolean>(false);
    const [isPurchaseSuccess, setIsPurchaseSuccess] = useState<boolean>(false);
    const [isPurchaseError, setIsPurchaseError] = useState<{isError: boolean; message: string}>({
        isError: false,
        message: "",
    });
    const [isConfirmPurchaseError, setIsConfirmPurchaseError] = useState<{isError: boolean; message: string}>({
        isError: false,
        message: "",
    });
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handlePurchase = async () => {
        let readyToPurchase = true;
        if (purchaseAmount === 0) {
            setIsPurchaseError({
                isError: true,
                message: "Vui lòng nhập số tiền nạp"
            });
            // error("Vui lòng nhập số tiền nạp");
            setSelectedTab(new Set(['1']));
            readyToPurchase = false;
        }
        if (!isConfirmPurchase) {
            setIsConfirmPurchaseError({
                isError: true,
                message: "Vui lòng xác nhận nạp tiền"
            });
            setSelectedTab(new Set(['1']));
            // error("Vui lòng xác nhận nạp tiền");
            readyToPurchase = false;
        }
        if (readyToPurchase) {
            setIsLoading(true);
            const response = await createPurchaseOrder(purchaseAmount, "123", true, [{id: "123", quantity: 1}]);
            setIsLoading(false);
            // @ts-ignore
            if (response.status !== 200) {
                // @ts-ignore
                error(response.error);
                return;
            }
            setIsPurchaseSuccess(true);
            success("yêu cầu nạp tiền đã được gửi lên hệ thống");
        }
        return readyToPurchase;
    }

    useEffect(() => {
        // @ts-ignore
        if (!selectedTab.has('1')) {
            if (purchaseAmount === 0) {
               setIsPurchaseError({
                     isError: true,
                     message: "Vui lòng nhập số tiền nạp"
                });
                // return;
            }
            if (!isConfirmPurchase) {

                setIsConfirmPurchaseError({
                    isError: true,
                    message: "Vui lòng xác nhận nạp tiền"
                });
                // return;
            }
        }
    }, [selectedTab]);

    return (
        <div className={"flex flex-col justify-center items-center px-2 pb-[90px] pt-[70px] w-full h-full"}>
            <Accordion
                variant="shadow"
                defaultExpandedKeys={['1']}
                selectedKeys={selectedTab}
                onSelectionChange={(keys) => setSelectedTab(keys)}
                className={"max-w-[500px] w-full  pt-5"}
            >
                <AccordionItem
                    key="1"
                    aria-label="Accordion 1"
                    title="Số tiền nạp"
                    classNames={{
                        content: "flex flex-col justify-center items-start gap-5",
                        title: "text-gray-600 font-bold",

                    }}
                >
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
                        onChange={(e) => {
                            const value = e.target.value;
                            setPurchaseAmount(Number(value));
                            if (value !== "") {
                                setIsPurchaseError({
                                    isError: false,
                                    message: ""
                                });
                            }
                        }}
                        errorMessage={isPurchaseError.isError && isPurchaseError.message}
                        isInvalid={isPurchaseError.isError}
                        endContent={
                            <div className="pointer-events-none flex items-center justify-center">
                                <span className="text-default-600 text-small">VND</span>
                            </div>
                        }
                    />
                    <div className={"flex flex-col justify-center items-start"}>
                        <Checkbox
                            defaultSelected={isConfirmPurchase}
                            onValueChange={(value) => {
                               setIsConfirmPurchase(value);
                               setIsConfirmPurchaseError({
                                   isError: !value,
                                   message: value ? "" : "Vui lòng xác nhận nạp tiền",
                               });
                            }}
                            color={"success"}
                            classNames={{
                                wrapper: "outline-none text-white",
                            }}
                        >
                            <p className={tw("text-[13px] text-gray-800", isConfirmPurchaseError.isError ? "text-red-500" : "")}>Xác nhận nạp tiền</p>
                        </Checkbox>
                    </div>
                </AccordionItem>
                <AccordionItem
                    key="2"
                    aria-label="Accordion 2"
                    title="Thanh toán"
                    classNames={{
                        title: "text-gray-600 font-bold"
                    }}
                >
                    <PurchaseGuideMemo />
                </AccordionItem>
                <AccordionItem
                    key="3"
                    aria-label="Accordion 3"
                    title="Xác nhận thanh toán"
                    classNames={{
                        title: "text-gray-600 font-bold"
                    }}
                >
                    <div className={"flex flex-col justify-center items-center gap-5 p-5"}>
                        <p className={"text-lg text-gray-800 font-semibold"}>
                            ID người dùng: {userData._id as unknown as string}
                        </p>
                        <p className={"text-lg text-gray-800 font-semibold"}>
                            Số tiền nạp: {formatCurrency(purchaseAmount.toString())}đ
                        </p>
                        <Button
                            onClick={() => {
                                handlePurchase();
                            }}
                            disabled={isLoading}
                            color={"success"}
                            className={"text-white flex justify-center items-center gap-2 font-bold text-md px-5 py-2 rounded-md hover:bg-green-600"}
                            // className={tw("px-5 py-2 bg-green-500 text-white font-semibold rounded-md", "hover:bg-green-600")}
                        >
                            {isLoading ? <Spinner color={"white"} size={"sm"}/> : ""}
                            Xác nhận
                        </Button>
                    </div>
                </AccordionItem>
            </Accordion>
        </div>
    );
}

export default BuyCreditScreen;