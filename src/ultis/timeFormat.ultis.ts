
export function formatISODate(isoDateString: Date): string {
    const isoDate = new Date(isoDateString);

    const year = isoDate.getFullYear();
    const month = String(isoDate.getMonth() + 1).padStart(2, '0');
    const day = String(isoDate.getDate()).padStart(2, '0');
    const hours = String(isoDate.getHours()).padStart(2, '0');
    const minutes = String(isoDate.getMinutes()).padStart(2, '0');
    const seconds = String(isoDate.getSeconds()).padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}`;
    const formattedTime = `${hours}:${minutes}`;

    return `${formattedDate} ${formattedTime}`;
}

interface FormattedDate {
    day: number;
    month: number;
    year: number;
    time: string;
}

export function formatDate(date: Date): FormattedDate {
    const day = date.getDate();
    const month = date.getMonth() + 1; // Month is zero-based, so add 1
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();

    // Format hours and minutes with leading zeros if needed
    const formattedHours = hours < 10 ? `0${hours}` : `${hours}`;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;

    // Construct the time string in HH:mm format
    const time = `${formattedHours}:${formattedMinutes}`;

    return { day, month, year, time };
}

