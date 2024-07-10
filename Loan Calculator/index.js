function calculateLoan() {
  const loanAmountValue = document.getElementById("loan-amount").value;
  const interestRateValue = document.getElementById("interest-rate").value;
  const monthsToPayValue = document.getElementById("months-to-pay").value;

  const interest = (loanAmountValue * (interestRateValue * 0.01)) / monthsToPayValue;
  const monthlyPayment = ((loanAmountValue / monthsToPayValue) + interest).toFixed(2);

  document.getElementById("payment").innerText = `Monthly Payment: $${monthlyPayment}`;
}