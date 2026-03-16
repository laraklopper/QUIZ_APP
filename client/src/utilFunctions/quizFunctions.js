// quizFunctions.js

    // Function to format the timer into mm:ss format
  export const formatTimer = (seconds) => {
    const minutes = Math.floor(seconds / 60);  // Calculate the number of minutes
    const secs = seconds % 60; // Calculate the remaining seconds
    // Return the formatted time as a string in mm:ss format
    // Pad seconds with a leading zero if less than 10
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };
  

    //Function to randomise answers
  
   export const shuffleArray = (array) => {
      //  Use the JavaScript sort method to shuffle the array
      // The comparison function returns a random value between -0.5 and 0.5
      // This results in a random order for each array element
      return array.sort(() => Math.random() - 0.5);
    }