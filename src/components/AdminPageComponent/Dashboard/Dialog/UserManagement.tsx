"use client"
import React, {useEffect, useLayoutEffect} from 'react';
import {Button, Input, Select, SelectItem, Spinner} from "@nextui-org/react";
import {formatCurrency} from "@/ultis/currency-format";
import {LuPlus} from "react-icons/lu";
import {EyeFilledIcon, EyeSlashFilledIcon} from "@nextui-org/shared-icons";
// import {useUserData} from "@/hooks/useUserData";
import {useToast} from "@/hooks/useToast";
import {useRouter} from "next/navigation";
import {BankingMethodUpdate} from "@/services/interface.authenticate";
import {UserInterface} from "types/userInterface";
import {ObjectId} from "mongodb";
import store from "@/adminRedux/store";
import {deleteUser, updateUsers} from "@/adminRedux/action/userData";
import {RootState} from "@/adminRedux/reducers";
import {useSelector} from "react-redux";

interface UserManagementProps {
    _id: string;
};

enum Status {
    isLoyalCustomer= "Khách hàng thân thiết",
    isNotLoyalCustomer = "Khách hàng mới",
}

function UserManagement({ _id}: UserManagementProps) {
    // const { userData, updateFullUserData } = useUserData();
    const [userData, setUserData] = React.useState<UserInterface>({
        _id: "" as unknown as ObjectId,
        fullName: "",
        balance: 0,
        phone: "",
        avatar: "",
        virtualVolume: 0,
        address: "",
        email: "",
        id_index: 0,
        total_request_withdraw: 0,
        isLoyalCustomer: false,
        revenue: 0,
        orders: 0,
        status: false,
        cart: [""],
        uid: "",
        bankingInfo: {
            bank: "",
            accountNumber: "",
            accountName: ""
        },
        role: "user",
        orderHistory: [""],
        transactions: [""],
        actionHistory: [""],
        withDrawHistory: [""],
        createdAt: new Date(),
        updatedAt: new Date(),
        allowDebitLimit: 1000,
        telegram: ""
    });

    const {success, error} = useToast();
    const data = useSelector((state: RootState) => state.users);
    const {push} = useRouter();
    const [confirmPassword, setConfirmPassword] = React.useState<string>("");
    const [newPassword, setNewPassword] = React.useState<string>("");
    const [oldPassword, setOldPassword] = React.useState<string>("");
    const [newBankingInfo, setNewBankingInfo] = React.useState<BankingMethodUpdate>({
        accountName: "",
        accountNumber: "",
        bank: ""
    });
    const [newTelegramLink, setNewTelegramLink] = React.useState<string>("");
    const [newAddress, setNewAddress] = React.useState<string>("");
    const [newPhone, setNewPhone] = React.useState<string>("");
    const [newBalance, setNewBalance] = React.useState<number>(0);
    const [isUpdating, setIsUpdating] = React.useState<boolean>(false);
    // const [isVisible, setIsVisible] = React.useState<boolean>(false);
    const [isLoading, setIsLoading] = React.useState<boolean>(true);
    const [enableChangeBalance, setEnableChangeBalance] = React.useState<boolean>(false);
    const [isLoyalCustomer, setIsLoyalCustomer] = React.useState<boolean>(false);
    const balanceRef = React.useRef<HTMLInputElement>(null);
    const handleUpdate = async () => {
        if (newPassword && confirmPassword) {
            if (newPassword !== confirmPassword) {
                return error("Mật khẩu xác nhận không khớp");
            }
            if (newPassword.length < 6) {
                return error("Mật khẩu phải có ít nhất 6 ký tự");
            }
        }
        setIsUpdating(true);
        const response = await fetch('/api/v1/admin/user/update-user', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                _id,
                // password: newPassword,
                data: {
                    address: newAddress,
                    phone: newPhone,
                    bankingInfo: newBankingInfo,
                    allowDebitLimit: newBalance,
                    isLoyalCustomer
                }
            })
        })
        setIsUpdating(false);
        if (response.status !== 200) {
            // @ts-ignore
            return error(response?.error);
        }
        success("Cập nhật thông tin thành công");
        store.dispatch(updateUsers(data.users.map(item => item._id as unknown as string === _id ? {
            ...item,
            address: newAddress,
            phone: newPhone,
            bankingInfo: newBankingInfo,
            allowDebitLimit: newBalance,
            isLoyalCustomer,
            telegram: newTelegramLink
        } : item) as UserInterface[]))
    }

    const deleteAccount = async () => {
        const response = await fetch('/api/v1/admin/user/delete-user', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
               userId: _id,
            })
        })
        if (response.status !== 200) {
            // @ts-ignore
            return success(response?.error);
        }
        store.dispatch(deleteUser(_id))
        success("Xóa tài khoản thành công");
    }

    const handleSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setIsLoyalCustomer(e.target.value === "isLoyalCustomer");
    }

    // const toggleVisibility = () => setIsVisible(!isVisible);
    useLayoutEffect(() => {
        // const userData = JSON.parse(window.localStorage.getItem("temp-user-data")).find(item => item._id === _id) as UserInterface;
        // if (!userData) {
        //     return;
        // }
        // console.log(userData)
        setIsLoading(true);
        // const userDataTemp = data.users.find(item => item._id as unknown as string === _id) as UserInterface
        // console.log(userDataTemp)
        // // setUserData();
        // // console.log()
        // if (!userDataTemp) {
            fetch('/api/v1/admin/user/get-user-by-id?id=' + _id).then(async (res) => {
                if (res.status !== 200) {
                    error("Không tìm thấy người dùng");
                    setIsLoading(true);
                    return ;
                }
                const data = await res.json();
                setUserData(data.data);
                setIsLoading(false);
                setNewAddress(data.data.address);
                setNewPhone(data.data.phone);
                setNewBankingInfo(data.data.bankingInfo);
                // console.log(userData)
                setNewTelegramLink(data.data.telegram);
                setNewBalance(data.data.allowDebitLimit);
            });
        // } else {
        //     setUserData(userDataTemp);
        //     setIsLoading(false);
        //     setNewAddress(userDataTemp.address);
        //     setNewPhone(userDataTemp.phone);
        //     setNewBankingInfo(userDataTemp.bankingInfo);
        //     setNewBalance(userDataTemp.balance);
        // }
        // if (!userData){
        //     return;
        // }

    }, []);

    // useEffect(() => {
    //
    // }, [_id]);
    return (
        <div className={"flex flex-col justify-center items-center gap-4"}>
            <div className={"w-full flex justify-center items-center"}>
                {isLoading ? <Spinner size={'lg'} color={"primary"}/> : (
                    <div className={"w-full flex flex-col justify-center item-center gap-2 p-5 max-w-[800px]"}>
                        <div className={"flex flex-col justify-center items-start gap-2"}>
                            <h1 className={"text-xl font-semibold text-start text-gray-500"}>Thông tin cá nhân</h1>
                            <Input
                                type={!enableChangeBalance ? "text" : "number"}
                                value={!enableChangeBalance ? formatCurrency(newBalance.toString()): newBalance.toString()}
                                classNames={{
                                    input: "text-danger-500 font-semibold text-lg",
                                }}
                                color={"danger"}
                                ref={debitRef => balanceRef.current = debitRef}
                                disabled={!enableChangeBalance}
                                label={"Số nợ cho phép"}
                                // startContent={<span className={"text-sm text-gray-500 w-20 whitespace-nowrap"}>Số nợ cho phép</span>}
                                endContent={
                                    <span
                                        className={"p-1 rounded bg-danger-500 text-white text-xl hover:bg-danger-600 cursor-pointer"}
                                        onClick={() => {
                                            setEnableChangeBalance(true);
                                            balanceRef.current?.focus();
                                        }}
                                    ><LuPlus/></span>}
                                onBlur={() => setEnableChangeBalance(false)}
                                onChange={(e) => {
                                    // console.log(e.target.value)
                                    setNewBalance(Number(e.target.value.replace(/\D/g, "")));
                                }}
                            />
                            <Select
                                items={Object.keys(Status).map((key) => ({
                                    value: key,
                                    label: Status[key as keyof typeof Status],
                                }))}
                                selectedKeys={[isLoyalCustomer ? "isLoyalCustomer" : "isNotLoyalCustomer"]}
                                label="Trạng thái"
                                // placeholder=""
                                className="max-w-xl"
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
                            <Input type="text" label={"Tên người dùng"} id={"newFullName"} value={userData.fullName}
                                   disabled/>
                            <Input type="text" label={"Email"} id={"newEmail"} value={userData.email} disabled/>
                            <Input
                                type="text"
                                placeholder={"telegram"}
                                // id={"newBankingInfo"}
                                value={newTelegramLink}
                                onChange={(e) => setNewTelegramLink(e.target.value)}/>
                        </div>
                        <div className={"w-full flex flex-col justify-center items-start gap-2"}>
                            <h1 className={"text-xl font-semibold text-start text-gray-500"}>Thông tin liên hệ</h1>
                            <div className={"w-full flex flex-col justify-center items-center gap-2"}>
                                <Input type="text" label={"Số điện thoại"} id={"newPhone"} value={newPhone}
                                       onChange={(e) => setNewPhone(e.target.value)} disabled/>
                            </div>
                            <div className={"w-full flex flex-col justify-center items-center gap-2"}>
                                <Input type="text" label={"Địa chỉ"} id={"newAddress"} value={newAddress}
                                       onChange={(e) => setNewAddress(e.target.value)} disabled/>
                            </div>
                        </div>
                        <div className={"flex flex-col justify-center items-start gap-2"}>
                            <h1 className={"text-xl font-semibold text-start text-gray-500"}>Thông tin ngân hàng</h1>
                            <Input type="text" placeholder={"Tên tài khoản"} id={"newBankingInfo"}
                                   value={newBankingInfo.accountName}
                                   onChange={(e) => setNewBankingInfo({
                                       ...newBankingInfo,
                                       accountName: e.target.value
                                   })}/>
                            <Input
                                type="text"
                                placeholder={"Số tài khoản"}
                                id={"newBankingInfo"}
                                value={newBankingInfo.accountNumber}
                                onChange={(e) => setNewBankingInfo({
                                    ...newBankingInfo,
                                    accountNumber: e.target.value
                                })}/>
                            <Input
                                type="text"
                                placeholder={"Ngân hàng"}
                                id={"newBankingInfo"}
                                value={newBankingInfo.bank}
                                onChange={(e) => setNewBankingInfo({...newBankingInfo, bank: e.target.value})}/>
                        </div>
                        {/*<div className={"w-full flex justify-center items-center p-5"}>*/}
                        {/*    <Button color={"success"} className={"text-white"} disabled={isUpdating} onClick={handleUpdate}>*/}
                        {/*        {isUpdating*/}
                        {/*            ? <span className={"flex justify-center items-center gap-1"}>*/}
                        {/*              <Spinner size={"sm"} color={"white"}/>*/}
                        {/*              <p>Đang cập nhật</p>*/}
                        {/*          </span>*/}
                        {/*            : "Lưu thay đổi"}*/}
                        {/*    </Button>*/}
                        {/*</div>*/}
                    </div>
                )}
            </div>
            <div className={"flex flex-row gap-2"}>
                <Button className={"bg-blue-600 text-white"} disabled={isUpdating} onClick={handleUpdate}>Lưu</Button>
                <Button className={"bg-red-500 text-white"} onClick={() => deleteAccount()}>Xóa</Button>
            </div>
        </div>
    );
}

export default UserManagement;