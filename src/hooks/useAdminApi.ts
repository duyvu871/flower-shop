import {UserInterface} from "types/userInterface";


export function useAdminApi() {
    const updateUserInfo = async (data: Partial<UserInterface>) => {
        const res = await fetch("/api/v1/auth/update/update-full-user", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        return await res.json();
    }
}