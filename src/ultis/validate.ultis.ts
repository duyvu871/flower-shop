
export function isEmail(input: string): boolean {
    const regex = /^([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+)\.([a-zA-Z]{2,})$/;
    return regex.test(input);
}

export function isNumber(input: string): boolean {
    const regex = /^\d+$/;
    return regex.test(input);
}


