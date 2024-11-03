document.getElementById('check-btn').addEventListener('click', function () {
    const input = document.getElementById('user-input').value;
    const resultElement = document.getElementById('results-div');
    
    if (input === "") {
        alert("Please provide a phone number");
        return;
    }

    // Regular expression to match valid US phone number formats
    const phoneRegex = /^(1\s?)?(\(\d{3}\)|\d{3})[\s-]?\d{3}[\s-]?\d{4}$/;

    if (phoneRegex.test(input)) {
        resultElement.textContent = `Valid US number: ${input}`;
    } else {
        resultElement.textContent = `Invalid US number: ${input}`;
    }
});

document.getElementById('clear-btn').addEventListener('click', function () {
    document.getElementById('results-div').textContent = "";
    document.getElementById('user-input').value = "";
});
