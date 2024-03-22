
export function storeToLocalStorage(key: string, data: any) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}

export function getFromLocalStorage(key: string) {
    try {
        return JSON.parse(localStorage.getItem(key) || "");
    } catch (error) {
        console.error(error);
        return null;
    }
}
