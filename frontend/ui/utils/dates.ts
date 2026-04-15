// Format date from DD/MM/YYYY to long form (e.g., "6th March 2026")
//also handle format 2025-10-28 16:02:23
export const formatDateToLongForm = (dateString: string): string => {
    //if dateString is in format 2025-10-28 16:02:23, convert it to DD/MM/YYYY
    if (!dateString) return '';
    if (dateString.includes('-')) {
        const parts = dateString.split('-');
        const day = parseInt(parts[2], 10);
        const month = parseInt(parts[1], 10);
        const year = parseInt(parts[0], 10);
        return formatDateToLongForm(`${day}/${month}/${year}`);
    }
    
    const parts = dateString.split('/');
    if (parts.length !== 3) return dateString;
    
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);
    
    if (isNaN(day) || isNaN(month) || isNaN(year)) return dateString;
    
    const date = new Date(year, month - 1, day);
    if (date.getDate() !== day || date.getMonth() !== month - 1 || date.getFullYear() !== year) {
        return dateString;
    }
    
    const getOrdinalSuffix = (day: number): string => {
        if (day >= 11 && day <= 13) return 'th';
        switch (day % 10) {
            case 1: return 'st';
            case 2: return 'nd';
            case 3: return 'rd';
            default: return 'th';
        }
    };
    
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    const ordinalDay = day + getOrdinalSuffix(day);
    const monthName = monthNames[month - 1];
    
    return `${ordinalDay} ${monthName} ${year}`;
};

export const checkIfDateIsUpcoming = (date: string) => {
    const [day, month, rest] = date.split("/");
    const year = rest.split(" ")[0];
    const d = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    return d >= new Date();
};

export const printIsUpcoming = (date: string) => {
    return checkIfDateIsUpcoming(date) ? "Upcoming" : "Past";
};

export const formatDateForEvents = (date: string) => {
    // Expected format: "DD/MM/YYYY H:MM am/pm"
    const [datePart, timePart, meridiem] = date.split(" ");
    const [day, month] = datePart.split("/");
    const monthName = new Date(2000, parseInt(month) - 1).toLocaleString("en-US", { month: "long" }).toUpperCase();
    const [hours, minutes] = timePart.split(":");
    let hour = parseInt(hours);
    if (meridiem?.toLowerCase() === "pm" && hour !== 12) hour += 12;
    if (meridiem?.toLowerCase() === "am" && hour === 12) hour = 0;
    const formattedTime = `${String(hour).padStart(2, "0")}:${minutes} ${meridiem.toUpperCase()}`;
    return `${parseInt(day)} ${monthName}, ${formattedTime}`;
};