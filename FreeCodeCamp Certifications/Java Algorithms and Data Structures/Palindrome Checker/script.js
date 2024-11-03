document.getElementById('check-btn').addEventListener('click', function () {
    const input = document.getElementById('text-input').value;
    const resultElement = document.getElementById('result');
    
    if (!input) {
        alert("Please input a value");
        return;
    }

    // Clean up the input by removing non-alphanumeric characters and converting to lowercase
    const cleanedInput = input.replace(/[^A-Za-z0-9]/g, '').toLowerCase();
    const reversedInput = cleanedInput.split('').reverse().join('');

    // Check if the cleaned input is a palindrome
    if (cleanedInput === reversedInput) {
        resultElement.textContent = `${input} is a palindrome`;
    } else {
        resultElement.textContent = `${input} is not a palindrome`;
    }
});