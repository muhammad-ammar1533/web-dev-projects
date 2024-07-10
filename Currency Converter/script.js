const apiKey = '256d24df472e9d4b6276dfc0';

document.getElementById('currency-form').addEventListener('submit', (e) => {
  e.preventDefault();

  const amount = document.getElementById('amount').value;
  const fromCurrency = document.getElementById('from-currency').value;
  const toCurrency = document.getElementById('to-currency').value;

  fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/pair/${fromCurrency}/${toCurrency}`)
    .then(response => response.json())
    .then(data => {
      const rate = data.conversion_rate;
      const result = (amount * rate).toFixed(2);
      document.getElementById('result').textContent = `${amount} ${fromCurrency} = ${result} ${toCurrency}`;
    });
});