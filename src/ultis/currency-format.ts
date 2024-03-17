
import { BigNumber } from "bignumber.js";

function addLargeNumber(a: string, b: string): string {
    let x = new BigNumber(a);
    let y = new BigNumber(b);
    let sum = x.plus(y);
    return sum.toString();
}

function subtractLargeIntegers(num1: string, num2: string): string {
    let a = new BigNumber(num1);
    let b = new BigNumber(num2);
    let difference = a.minus(b);
    return difference.toString();
}

function multiplyLargeNumbers(a: string, b: string): string {
    let x = new BigNumber(a);
    let y = new BigNumber(b);
    let product = x.multipliedBy(y);
    return product.toString();
}

function divideLargeIntegers(dividend: string, divisor: string): string {
    let x: BigNumber = new BigNumber(dividend);
    let y: BigNumber = new BigNumber(divisor);
    let quotient: string = x.dividedBy(y).toString();
    return quotient;
}

// Hàm so sánh hai số nguyên lớn
function compareLargeIntegers(num1: string, num2: string): number {
    if (num1 === num2) {
        return 0;
    } else if (num1.length < num2.length) {
        return -1;
    } else if (num1.length > num2.length) {
        return 1;
    } else {
        return num1.localeCompare(num2);
    }
}

export function formatCurrency(value: string): string {
    // Xóa dấu ',' hiện có nếu có
    value = value.replace(/,/g, '');

    const parts = value.split('.');
    const wholeNumber = parts[0];
    const decimalPart = parts[1] || '';

    const formattedWholeNumber = wholeNumber.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    return decimalPart ? `${formattedWholeNumber}.${decimalPart}` : formattedWholeNumber;
}

export function usdtToVndIntegers(usdt: number | string, exchangeRate: number | string): string {
    return formatCurrency(
        multiplyLargeNumbers(
            usdt.toString(),
            exchangeRate.toString()
        )
    );
}

export function calculateDiscount(price: string, discount: number | string): string {
    return formatCurrency(
        multiplyLargeNumbers(
            price,
            divideLargeIntegers(
                discount.toString(),
                '100'
            )
        )
    );
}
export {divideLargeIntegers, multiplyLargeNumbers, subtractLargeIntegers, addLargeNumber};