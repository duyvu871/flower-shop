"use client"
import React, {useEffect} from 'react';
import {Button, Input, Spinner} from "@nextui-org/react";
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
import {deleteUser} from "@/adminRedux/action/userData";

interface UserManagementProps {
    _id: string;
};

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
        withDrawHistory: [""]
    });

    const {success, error} = useToast();
    const {push} = useRouter();
    const [confirmPassword, setConfirmPassword] = React.useState<string>("");
    const [newPassword, setNewPassword] = React.useState<string>("");
    const [oldPassword, setOldPassword] = React.useState<string>("");
    const [newBankingInfo, setNewBankingInfo] = React.useState<BankingMethodUpdate>({
        accountName: "",
        accountNumber: "",
        bank: ""
    });
    const [newAddress, setNewAddress] = React.useState<string>("");
    const [newPhone, setNewPhone] = React.useState<string>("");
    const [isUpdating, setIsUpdating] = React.useState<boolean>(false);
    const [isVisible, setIsVisible] = React.useState<boolean>(false);

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
                address: newAddress,
                phone: newPhone,
                bankingInfo: newBankingInfo
            })

        })
        setIsUpdating(false);
        if (response.status !== 200) {
            // @ts-ignore
            return success(response?.error);
        }
        success("Cập nhật thông tin thành công");
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

    // const toggleVisibility = () => setIsVisible(!isVisible);
    useEffect(() => {
        const userData = JSON.parse(window.localStorage.getItem("temp-user-data")).find(item => item._id === _id) as UserInterface;
        console.log(userData)
        setUserData(userData);
        setNewAddress(userData.address);
        setNewPhone(userData.phone);
        setNewBankingInfo(userData.bankingInfo);
    }, []);

    useEffect(() => {

    }, [_id]);
    return (
        <div className={"flex flex-col justify-center items-center gap-4"}>
            <div>
                <div className={"w-full flex flex-col justify-center item-center gap-2 p-5 max-w-[800px]"}>
                    <div className={"flex flex-col justify-center items-start gap-2"}>
                        <h1 className={"text-xl font-semibold text-start text-gray-500"}>Thông tin cá nhân</h1>
                        <Input
                            type="text"
                            value={formatCurrency(userData.balance.toString()) + "VND"}
                            classNames={{
                                input: "text-green-500 font-semibold text-lg",
                            }}
                            color={"success"}
                            disabled
                            startContent={<span className={"text-sm text-gray-500 w-14"}>Số dư</span>}
                            endContent={
                            <span
                                className={"p-1 rounded bg-green-500 text-white text-xl hover:bg-green-600"}
                               ><LuPlus/></span>}
                        />
                        <Input type="text" label={"Tên người dùng"} id={"newFullName"} value={userData.fullName} disabled/>
                        <Input type="text" label={"Email"} id={"newEmail"} value={userData.email} disabled/>
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
                               onChange={(e) => setNewBankingInfo({...newBankingInfo, accountName: e.target.value})}/>
                        <Input
                            type="text"
                            placeholder={"Số tài khoản"}
                            id={"newBankingInfo"}
                            value={newBankingInfo.accountNumber}
                            onChange={(e) => setNewBankingInfo({...newBankingInfo, accountNumber: e.target.value})}/>
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
            </div>
            <div className={"flex flex-row gap-2"}>
                <Button className={"bg-blue-600 text-white"}  disabled={isUpdating} onClick={handleUpdate}>Lưu</Button>
                <Button className={"bg-red-500 text-white"} onClick={() => deleteAccount()}>Xóa</Button>
            </div>
        </div>
    );
}

export default UserManagement;