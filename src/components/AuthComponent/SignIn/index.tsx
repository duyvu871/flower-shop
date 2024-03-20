"use client";

import React, {useLayoutEffect} from 'react';
import {
    Spacer,
    Button,
    Input,
    Checkbox, Link,
} from '@nextui-org/react';
// import { IoMail } from "react-icons/io5";
// import { FaLock } from "react-icons/fa";
import {EyeFilledIcon, EyeSlashFilledIcon} from "@nextui-org/shared-icons";
import {useToast} from "@/hooks/useToast";
import {useRouter} from "next/navigation";
import { signIn } from "next-auth/react";
import {useAuth} from "@/hooks/useAuth";


export default function SignInForm() {
    // const {isLogin, user} = useAuth();
    const [email, setEmail] = React.useState<string>("");
    const [password, setPassword] = React.useState<string>("");
    const [isRemember, setIsRemember] = React.useState<boolean>(false);
    const [preventButton, setPreventButton] = React.useState<boolean>(false);

    const {error, success} = useToast();
    const {push} = useRouter();

    const [value, setValue] = React.useState<string>("");
    const validateEmail = (value: string): RegExpMatchArray | null => value.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i);

    const isInvalid = React.useMemo(() => {
        if (value === "") return false;
        const isValidMail = Boolean(value) //validateEmail(value);
        setPreventButton(!isValidMail);
        return !isValidMail;
    }, [value]);

    const isInvalidPassword = React.useMemo(() => {
        if (password === "") return false;
        setPreventButton(password.length < 6);
        return password.length < 6;
    }, [password]);

    const [isVisible, setIsVisible] = React.useState(false);
    const login = async () => {
        if (email === "" || password === "") {
            error("Vui lòng nhập thông tin tài khoản");
            return;
        }
        const res = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        if(res?.error) {
            console.log(res.error);
            if (res.error === "Email is not verified") {
                error("Email chưa được xác thực");
                return;
            }
            error("Đăng nhập thất bại");
        } else {
            push("/");
        }
    }
    const toggleVisibility = () => setIsVisible(!isVisible);

    // useLayoutEffect(() => {
    //     if (isLogin) {
    //         push("/");
    //     }
    // }, [isLogin]);

    return (
        <div className={"flex justify-center items-start h-full bg-gray-100 p-5 mobile:p-10"}>
            <div className={"w-[600px] bg-white p-2 mobile:p-5 py-10 rounded-xl"}>
                <p className={"text-[24px] font-bold text-center mb-8 text-gray-800"}>
                    Đăng nhập
                </p>
                <div className={"px-4"}>
                    <Input
                        autoComplete={"off"}
                        spellCheck={false}
                        autoCapitalize={"off"}
                        fullWidth
                        value={value}
                        type="text"
                        label="Tài khoản"
                        variant="bordered"
                        placeholder="Tên đăng nhập hoặc email"
                        isInvalid={isInvalid}
                        color={isInvalid ? "danger" : "primary"}
                        errorMessage={isInvalid && "Vui lòng nhập đúng định dạng tài khoản"}
                        onValueChange={(value) => {
                            setEmail(value);
                            setValue(value);
                        }}

                        className="max-w-xl text-gray-800"
                    />
                    <Spacer y={6}/>
                    <Input
                        autoComplete={"off"}
                        spellCheck={false}
                        label="Mật khẩu"
                        variant="bordered"
                        placeholder="Nhập mật khẩu"
                        value={password}
                        isInvalid={isInvalidPassword}
                        color={isInvalidPassword ? "danger" : "primary"}
                        errorMessage={isInvalidPassword && "Hãy nhập mật khẩu có độ dài lớn hơn 6 ký tự"}
                        endContent={
                            <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
                                {isVisible ? (
                                    <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none"/>
                                ) : (
                                    <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none"/>
                                )}
                            </button>
                        }
                        type={isVisible ? "text" : "password"}
                        onValueChange={(value) => setPassword(value)}
                        className="max-w-xl text-gray-800"
                    />
                    <Spacer y={6}/>
                    <div className={"flex justify-between items-start gap-2"}>
                        <Checkbox onValueChange={(value) => setIsRemember(value)}>
                            <p className={"text-[13px] text-gray-800"}>Lưu thông tin đăng nhập</p>
                        </Checkbox>
                        <div className={"flex flex-col "}>
                            <p className={"text-[13px] text-gray-800 cursor-pointer"}>Quên mật khẩu?</p>
                            <Link href={"/auth/signup"}>
                                <p className={"text-[13px] text-orange-600"}>Chưa có tài khoản?</p>
                            </Link>
                        </div>
                    </div>
                    <Spacer y={3}/>
                    <Button
                        disabled={preventButton}
                        onClick={login}
                        className={"w-full bg-orange-600 text-white cursor-pointer"}
                        color="primary"
                        variant="flat"
                    >
                        Đăng Nhập
                    </Button>
                    <Spacer y={6}/>
                    <div className={"flex justify-start"}>

                    </div>
                    <div>
                        Bằng việc đăng nhập, bạn đã đồng ý với các <a href="#" className={"text-orange-600"}>điều
                        khoản sử dụng</a> của chúng tôi
                    </div>
                </div>
            </div>
        </div>
    );
}