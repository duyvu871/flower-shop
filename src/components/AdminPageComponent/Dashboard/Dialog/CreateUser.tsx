import React from 'react';
import {Button, Input, Spacer} from "@nextui-org/react";
import {EyeFilledIcon, EyeSlashFilledIcon} from "@nextui-org/shared-icons";
import {useToast} from "@/hooks/useToast";

interface CreateUserProps {

};

function CreateUser({}: CreateUserProps) {
    const {error, success} = useToast()
    const [isVisible, setIsVisible] = React.useState<boolean>(false);
    const [isRetypeVisible, setIsRetypeVisible] = React.useState<boolean>(false);
    const [formState, setFormState] = React.useState({
        fullName: "",
        fullNameError: "",
        phoneNumber: "",
        phoneNumberError: "",
        email: "",
        emailError: "",
        password: "",
        passwordError: "",
        retypePassword: "",
        retypePasswordError: "",
        preventButton: false
    });

    const sendSignUpRequest = async function() {
        const { fullName, phoneNumber, email, password, retypePassword } = formState;
        const requestBody = {
            email,
            password,
            phone: phoneNumber,
            fullName,
        }

        const res = await fetch("/api/v1/auth/sign-up", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestBody)
        });

        const data = await res.json();
        if (res.status === 200) {
            success("Đăng kí thành công");
            // push("/auth/signin");
        } else {
            error(data.error);
        }
    }

    const register = async (type: "submit"|"check") => {
        const { fullName, phoneNumber, email, password, retypePassword } = formState;

        if (!fullName) {
            setFormState({ ...formState, fullNameError: "Tên đầy đủ không được bỏ trống" });
            return error('Tên đầy đủ không được bỏ trống');
        } else {
            setFormState({ ...formState, fullNameError: "" });
        }

        if (!validatePhone(phoneNumber)) {
            setFormState({ ...formState, phoneNumberError: 'Vui lòng nhập đúng số điện thoại' });
            return error('Vui lòng nhập đúng số điện thoại');
        } else {
            setFormState({ ...formState, phoneNumberError: '' });
        }

        if (!email) {
            setFormState({ ...formState, emailError: "Vui lòng nhập tên đăng nhập" });
            return error('Vui lòng nhập tên đăng nhập');
        } else {
            setFormState({ ...formState, emailError: "" });
        }

        if (password.length < 6) {
            setFormState({ ...formState, passwordError: "Mật khẩu phải có độ dài lớn hơn 6 ký tự" });
            return error('Mật khẩu phải có độ dài lớn hơn 6 ký tự');
        } else {
            setFormState({ ...formState, passwordError: "" });
        }

        if (retypePassword !== password) {
            setFormState({ ...formState, retypePasswordError: "Mật khẩu không trùng khớp" });
            return error('Mật khẩu không trùng khớp');
        } else {
            setFormState({ ...formState, retypePasswordError: "" });
        }

        if (type === "submit") {
            await sendSignUpRequest();
        }
    };

    const forceFormState = (key: string, value: string) => {
        setFormState((prev) => ({
            ...prev,
            [key]: value
        }));
    }

    const toggleVisibility = () => {
        setIsVisible((prev) => !prev);
    }

    const toggleRetypeVisibility = () => {
        setIsRetypeVisible((prev) => !prev);
    }

    const validateEmail = (email: string): boolean => {
        const re = /\S+@\S+\.\S+/;
        return re.test(email);
    }

    const validatePhone = (phone: string): boolean => {
        const re = /((09|03|07|08|05)+([0-9]{8})\b)/g;
        return re.test(phone);
    }


    return (
        <div className={"flex flex-col justify-center items-center w-full"}>
            <div className={"pb-4"}>
                <h1 className={"text-2xl font-bold"}>Tạo tài khoản</h1>
            </div>
            <div className={"flex flex-col justify-center items-center w-full"}>
                <div className={"flex flex-col justify-center items-start md:flex-row gap-4"}>
                    <Input
                        type="text"
                        autoSave={"on"}
                        spellCheck={false}
                        autoCapitalize={"off"}
                        // value={formState.fullName}
                        label="Tên đăng nhập"
                        variant={"bordered"}
                        // labelPlacement={"outside"}
                        isInvalid={!!formState.fullNameError}
                        color={!!formState.fullNameError ? "danger" : "primary"}
                        errorMessage={formState.fullNameError}
                        onValueChange={(value) => {
                            if (value === "") {
                                forceFormState("fullNameError", "Tên đầy đủ không được bỏ trống");
                                return;
                            } else forceFormState("fullNameError", "");
                            forceFormState("fullName", value);
                        }}
                    />
                    <Input
                        type="text"
                        autoSave={"off"}
                        spellCheck={false}
                        // value={formState.phoneNumber}
                        label="Số điện thoại"
                        variant={"bordered"}
                        // color={"primary"}
                        // labelPlacement={"outside"}
                        isInvalid={!!formState.phoneNumberError}
                        color={!!formState.phoneNumberError ? "danger" : "primary"}
                        errorMessage={formState.phoneNumberError}
                        onValueChange={(value) => {
                            if (value === "") {
                                forceFormState("phoneNumberError", "Vui lòng nhập số điện thoại");
                                return;
                            } else if (!validatePhone(value)) {
                                forceFormState("phoneNumberError", "Vui lòng nhập đúng số điện thoại");
                                return;
                            }
                            forceFormState("phoneNumberError", "");
                            forceFormState("phoneNumber", value);
                        }}
                    />
                </div>
                <Spacer y={4}/>
                <Input
                    autoComplete={"off"}
                    spellCheck={false}
                    autoSave={"off"}
                    fullWidth
                    type="text"
                    label="Tài khoản"
                    variant="bordered"
                    placeholder="email"
                    isInvalid={!!formState.emailError}
                    color={!!formState.emailError ? "danger" : "primary"}
                    errorMessage={formState.emailError}
                    onValueChange={(value) => {
                        if (value === "") {
                            forceFormState("emailError", "vui lòng nhập email");
                            return;
                        } else if (!validateEmail(value)) {
                            forceFormState("emailError", "vui lòng nhập đúng định dạng email");
                            return;
                        }
                        forceFormState("emailError", "");
                        forceFormState("email", value);
                    }}

                    className="max-w-xl text-gray-800"
                />
                <Spacer y={4}/>
                <Input
                    autoComplete={"off"}
                    autoSave={"off"}
                    spellCheck={false}
                    label="Mật khẩu"
                    variant="bordered"
                    placeholder="Nhập mật khẩu"
                    // value={formState.password}
                    isInvalid={!!formState.passwordError}
                    color={!!formState.passwordError ? "danger" : "primary"}
                    errorMessage={formState.passwordError}
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
                    onValueChange={(value) => {
                        if (value === "") {
                            forceFormState("passwordError", "Vui lòng nhập mật khẩu");
                            return;
                        } else if (value.length < 6) {
                            forceFormState("passwordError", "Mật khẩu không được dưới 6 kí tự");
                            return;
                        }
                        forceFormState("passwordError", "");
                        forceFormState("password", value);

                    }}
                    className="max-w-xl text-gray-800"
                />
                <Spacer y={4}/>
                <Input
                    autoComplete={"off"}
                    autoSave={"off"}
                    spellCheck={false}
                    label="Nhập lại mật khẩu"
                    variant="bordered"
                    placeholder="Nhập lại mật khẩu"
                    // value={formState.retypePassword}
                    isInvalid={!!formState.retypePasswordError}
                    color={!!formState.retypePasswordError ? "danger" : "primary"}
                    errorMessage={formState.retypePasswordError}
                    endContent={
                        <button className="focus:outline-none" type="button" onClick={toggleRetypeVisibility}>
                            {isRetypeVisible ? (
                                <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none"/>
                            ) : (
                                <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none"/>
                            )}
                        </button>
                    }
                    type={isRetypeVisible ? "text" : "password"}
                    onValueChange={(value) => {
                        // console.log(formState.retypePassword, formState.password)
                        if (value === "") {
                            forceFormState("retypePasswordError", "Vui lòng nhập mật khẩu");
                            return;
                        } else if (value.length < 6) {
                            forceFormState("retypePasswordError", "Mật khẩu không được dưới 6 kí tự");
                            return;
                        } else if (value !== formState.password) {
                            forceFormState("retypePasswordError", "Mật khẩu không trùng khớp");
                            return;
                        }
                        forceFormState("retypePasswordError", "");
                        forceFormState("retypePassword", value);
                    }}
                    className="max-w-xl text-gray-800"
                />
            </div>
            <Button
                disabled={formState.preventButton}
                onClick={() => register("submit")}
                className={"w-full bg-orange-600 text-white"}
                color="primary"
                variant="flat"
            >
                Đăng Ký
            </Button>
        </div>
    );
}

export default CreateUser;