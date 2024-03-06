import { twMerge } from "tailwind-merge";
export function tw(...args: string[]) {
    return twMerge(...args);
}