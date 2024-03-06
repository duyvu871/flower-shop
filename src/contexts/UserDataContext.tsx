"use client";
import {createContext, ReactNode, useCallback, useLayoutEffect, useState} from "react";
import {UserInterface} from "@/types/userInterface";
import {useSession} from "next-auth/react";
import {ObjectId, WithId} from "mongodb";
import {OrderType} from "types/order";
import {BankingMethodUpdate} from "@/services/interface.authenticate";

interface ExtendedUserInterface {
    userData: WithId<UserInterface>;
    userWithdrawalHistory: OrderType[];
    // setUserData: Dispatch<SetStateAction<UserInterface>>;
    updateBankingMethod: (bankMethod: BankingMethodUpdate) => Promise<any>;
    updatePassword: (oldPassword: string, newPassword: string) => Promise<any>;
    createOrder: (volume: number) => Promise<any>;
    getUserData: () => Promise<WithId<UserInterface>|null>;
    updateUserData: (data: Partial<WithId<UserInterface>>, key?: keyof WithId<UserInterface>) => void;
    getWithdrawalHistory: (list: ObjectId[]) => Promise<any>;
    updateUserWithdrawalHistory: (data: OrderType) => void;
}

const defaultUserData: WithId<UserInterface> = {
    _id: "" as unknown as ObjectId,
    username: "",
    balance: 1000,
    uid: "",
    bankingInfo: {
        bank: "",
        accountNumber: "",
        accountName: ""
    },
    role: "user",
    transactions: [""],
    actionHistory: [""],
    withDrawHistory: [""],
}

export const UserDataContext = createContext<ExtendedUserInterface>({
    userData: defaultUserData,
    userWithdrawalHistory: [],
    updateBankingMethod: async (bankMethod: BankingMethodUpdate) => {},
    updatePassword: async (oldPassword: string, newPassword: string) => {},
    createOrder: async (volume: number) => {},
    getUserData: async () => defaultUserData,
    updateUserData: (data: Partial<WithId<UserInterface>>, key?: keyof WithId<UserInterface>) => {},
    getWithdrawalHistory: async (list: ObjectId[]) => {},
    updateUserWithdrawalHistory: (data: OrderType) => {}
});

export const UserDataProvider = ({children}: {children: ReactNode}) => {
    const session = useSession();
    const { data: sessionData } = session;
    const [userData, setUserData] = useState<WithId<UserInterface>>(defaultUserData);
    const [userWithdrawalHistory, setUserWithdrawalHistory] = useState<OrderType[]>([]);
    // update user data
    const updateUserData = useCallback(function (
        data: Partial<WithId<UserInterface>>, key?: keyof WithId<UserInterface>
    ) {
        if (key) {
            //update specific key
            setUserData((prevData) => ({ ...prevData, [key]: data[key] }));
        } else {
            //update all data
            setUserData((prevData) => ({ ...prevData, ...data }));
        }
    }, []);
    //update user withdrawal history
    const updateUserWithdrawalHistory = useCallback(function (data: OrderType) {
        setUserWithdrawalHistory((prevData) => ([data, ...prevData]));
    }, []);
    // update banking method
    const updateBankingMethod = useCallback(async function (bankMethod: BankingMethodUpdate) {
        const res = await fetch('/api/v1/auth/update/update-banking-method', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({...bankMethod})
        });

        if (res.status === 200) {
            setUserData({...userData, bankingInfo: bankMethod});
        }
        return res.json();
    }, [userData]);
    // update password
    const updatePassword = useCallback(async function (oldPassword: string, newPassword: string) {
        const res = await fetch('/api/v1/auth/update/update-password', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({oldPassword, newPassword})
        });

        return res.json();
    }, []);
    // create order
    const createOrder = useCallback(async function (volume: number) {
        return await fetch('/api/v1/order/withdraw', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({volume, uid: userData._id})
        });
    }, [userData])
    // get user data
    const getUserData = useCallback(async function () {
        const res = await fetch(`/api/v1/info/get-user-data`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (res.status === 200) {
            const data: WithId<UserInterface> = await res.json();
            setUserData(data);
            console.log(data);
            return data;
        }
        return null;
    }, [sessionData]);
    //get withdrawal history
    const getWithdrawalHistory = useCallback(async function (drawList: ObjectId[]) {
        const res = await fetch(`/api/v1/info/get-withdrawal-history`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({drawList})
        });
        if (res.status !== 200) {
            return [];
        }
        return await res.json();
    }, [sessionData]);

    useLayoutEffect( () => {
        const fetchData = async () => {
            try {
                if (sessionData) {
                    const data = await getUserData();
                    if (data) {
                        // console.log(data.withDrawHistory)
                        const withdrawalHistory = await getWithdrawalHistory(data.withDrawHistory as unknown as ObjectId[]);
                        console.log("withdrawalHistory", withdrawalHistory);
                        setUserWithdrawalHistory(withdrawalHistory);
                    }
                }
            } catch (err) {
                console.error(err);
            }
        };

        fetchData();
    }, [sessionData]);

    return (
        <UserDataContext.Provider value={{
            userWithdrawalHistory,
            userData,
            updateBankingMethod,
            updatePassword,
            createOrder,
            getUserData,
            updateUserData,
            getWithdrawalHistory,
            updateUserWithdrawalHistory
        }}>
            {children}
        </UserDataContext.Provider>
    )
}