import { Dispatch, SetStateAction, useEffect, useState } from "react";

export default function useLocalStorage<T>(
    key: string,
    initialValue: T
): [T, Dispatch<SetStateAction<T>>] {
    const [storedValue, setStoredValue] = useState(initialValue);
    const [firstLoadDone, setFirstLoadDone] = useState(false);
    useEffect(() => {
        const fromLocal = () => {
            if (typeof window === "undefined") {
                return initialValue;
            }
            try {
                const item = window.localStorage.getItem(key);
                return item ? (JSON.parse(item) as T) : initialValue;
            } catch (error) {
                console.error(error);
                return initialValue;
            }
        };
        setStoredValue(fromLocal);
        setFirstLoadDone(true);
        return () => {
            setFirstLoadDone(false);
        }
    }, [initialValue, key]);
    function setLocalValue(value: T) {
        if (!firstLoadDone) {
            return;
        }
        try {
            if (typeof window !== "undefined") {
                window.localStorage.setItem(key, JSON.stringify(value));
            }
        } catch (error) {
            console.log(error);
        }
    }
    const setValue: Dispatch<SetStateAction<T>> = (value) => {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setLocalValue(valueToStore);
        setStoredValue(valueToStore);
    };
    return [storedValue, setValue];
}