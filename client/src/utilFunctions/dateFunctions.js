//---------DATE FUNCTIONS----------------------
// Function to specify the date format
export const dateDisplay = (dateString) => {
    const options = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    }
    return new Date(dateString).toLocaleDateString('en-GB', options);
}

// Function to get the current date in 'DD/MM/YYYY' format
export const currentDate = () => {
    const options = {
        day: '2-digit', // Display day as two digit
        month: '2-digit',  // Display month as two digits
        year: 'numeric',// Display year as four digits
        timeZone: 'Africa/Johannesburg'// Set the timezone
    };
    return new Intl.DateTimeFormat('en-GB', options).format(new Date());// Format the current date
};
