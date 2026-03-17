//---------DATE FUNCTIONS----------------------

// Formats a date string (e.g. from a database) into dd/mm/yyyy
// Returns an empty string if the input is missing or invalid
export const dateDisplay = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return ''; // Guard against invalid dates
    const options = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        timeZone: 'Africa/Johannesburg' // Display date in South African timezone
    }
    return date.toLocaleDateString('en-GB', options);
}

// Formats a Date object into hh:mm:ss using 24-hour time
// Returns an empty string if the input is not a valid Date
export const timeDisplay = (dateObj) => {
    if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) return '';
    return dateObj.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false, // Use 24-hour clock
    });
};

// Returns today's date formatted as dd/mm/yyyy
export const currentDate = () => {
    const options = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        timeZone: 'Europe/Bucharest'
    };
    return new Intl.DateTimeFormat('en-GB', options).format(new Date());
};
