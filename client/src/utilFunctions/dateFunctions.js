//---------DATE FUNCTIONS----------------------
// Function to specify the date format
export const dateDisplay = (dateString) => {
    const options = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        timeZone: 'Africa/Johannesburg'// Set the timezone
    }
    return new Date(dateString).toLocaleDateString('en-GB', options);
}

// Function to specify the time format
// Format time as hh:mm:ss
export const timeDisplay = (dateObj) => {
    return dateObj.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
    });
};