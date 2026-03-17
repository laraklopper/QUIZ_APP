// quizFunctions.js

// Converts a total number of seconds into a mm:ss formatted string
// e.g. 75 -> "1:15"
export const formatTimer = (seconds) => {
    const minutes = Math.floor(seconds / 60); // Whole minutes
    const secs = seconds % 60; // Remaining seconds
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`; // Pad seconds with leading zero if needed
};

// Randomises the order of an array in place
// Uses a Fisher-Yates-style approach via sort with a random comparator
export const shuffleArray = (array) => {
    return array.sort(() => Math.random() - 0.5);
};
