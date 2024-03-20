"use client";
import React, {useEffect} from 'react';
import {BankingMethodUpdate} from "@/services/interface.authenticate";
import {useUserData} from "@/hooks/useUserData";
import {Button, Input, Spinner} from "@nextui-org/react";
import {useToast} from "@/hooks/useToast";

interface UserInfoScreenProps {

};

function UserInfoScreen({}: UserInfoScreenProps) {
    const { userData, updateFullUserData } = useUserData();
    const {success, error} = useToast();
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
        const response = await updateFullUserData({
            password: newPassword,
            address: newAddress,
            phone: newPhone,
            bankingInfo: newBankingInfo
        });
        setIsUpdating(false);
        if (response.status !== 200) {
            // @ts-ignore
            return alert(response?.error);
        }
        success("Cập nhật thông tin thành công");
    }

    useEffect(() => {
        setNewAddress(userData.address);
        setNewPhone(userData.phone);
        setNewBankingInfo(userData.bankingInfo);
    }, [userData]);

    return (
        <div className={"flex flex-col justify-center items-center pb-[90px] pt-[70px]"}>
            <div className={"w-full flex flex-col justify-center item-center gap-2 p-5 max-w-[500px]"}>
                <div className={"flex flex-col justify-center items-start gap-2"}>
                    <h1 className={"text-xl font-semibold text-start text-gray-500"}>Thông tin cá nhân</h1>
                    <Input type="text" label={"Tên người dùng"} id={"newFullName"} value={userData.fullName} disabled/>
                    <Input type="text" label={"Email"} id={"newEmail"} value={userData.email} disabled/>
                    <Input
                        type="password"
                        label={"Mật khẩu cũ"}
                        id={"oldPassword"}
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}/>
                    <div className={"flex flex-row justify-center items-center gap-2"}>
                        <Input
                            type="password"
                            label={"Mật khẩu mới"}
                            id={"newPassword"}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}/>
                        <Input
                            type="password"
                            label={"Xác nhận mật khẩu"}
                            id={"confirmPassword"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}/>
                    </div>
                </div>
                <div className={"w-full flex flex-col justify-center items-start gap-2"}>
                    <h1 className={"text-xl font-semibold text-start text-gray-500"}>Thông tin liên hệ</h1>
                    <div className={"w-full flex flex-col justify-center items-center gap-2"}>
                        <Input type="text" label={"Số điện thoại"} id={"newPhone"} value={newPhone}
                               onChange={(e) => setNewPhone(e.target.value)}/>
                    </div>
                    <div className={"w-full flex flex-col justify-center items-center gap-2"}>
                        <Input type="text" label={"Địa chỉ"} id={"newAddress"} value={newAddress}
                               onChange={(e) => setNewAddress(e.target.value)}/>
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
               <div className={"w-full flex justify-center items-center p-5"}>
                   <Button color={"success"} className={"text-white"} disabled={isUpdating} onClick={handleUpdate}>
                          {isUpdating
                              ? <span className={"flex justify-center items-center"}>
                                  <Spinner size={"sm"}/>
                                  <p>Đang cập nhật</p>
                              </span>
                              : "Lưu thay đổi"}
                   </Button>
               </div>
            </div>
        </div>
    );
}

export default UserInfoScreen;