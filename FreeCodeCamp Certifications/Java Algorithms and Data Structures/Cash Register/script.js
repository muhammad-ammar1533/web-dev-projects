let price = 1.87;
let cid = [
  ['PENNY', 1.01],
  ['NICKEL', 2.05],
  ['DIME', 3.1],
  ['QUARTER', 4.25],
  ['ONE', 90],
  ['FIVE', 55],
  ['TEN', 20],
  ['TWENTY', 60],
  ['ONE HUNDRED', 100]
];

const DENOMINATION_VALUES = {
  'PENNY': 0.01,
  'NICKEL': 0.05,
  'DIME': 0.1,
  'QUARTER': 0.25,
  'ONE': 1,
  'FIVE': 5,
  'TEN': 10,
  'TWENTY': 20,
  'ONE HUNDRED': 100
};

// Get elements
const cashInput = document.getElementById('cash');
const changeDueElement = document.getElementById('change-due');
const purchaseBtn = document.getElementById('purchase-btn');

purchaseBtn.addEventListener('click', function() {
  let cash = parseFloat(cashInput.value);
  let changeDue = parseFloat((cash - price).toFixed(2));

  if (changeDue < 0) {
    alert("Customer does not have enough money to purchase the item");
    return;
  }
  if (changeDue === 0) {
    changeDueElement.textContent = "No change due - customer paid with exact cash";
    return;
  }

  let totalCashInDrawer = parseFloat(cid.reduce((acc, [denom, amount]) => acc + amount, 0).toFixed(2));

  if (totalCashInDrawer < changeDue) {
    changeDueElement.textContent = "Status: INSUFFICIENT_FUNDS";
    return;
  }

  if (totalCashInDrawer === changeDue) {
    changeDueElement.textContent = `Status: CLOSED ${formatChangeArray(cid)}`;
    return;
  }

  let changeArray = getChange(changeDue, cid);
  if (changeArray) {
    changeDueElement.textContent = `Status: OPEN ${formatChangeArray(changeArray)}`;
  } else {
    changeDueElement.textContent = "Status: INSUFFICIENT_FUNDS";
  }
});

// Function to calculate the change
function getChange(changeDue, cid) {
  let change = [];
  let sortedCid = [...cid].reverse();

  for (let [denom, amount] of sortedCid) {
    let denomValue = DENOMINATION_VALUES[denom];
    let denomAmount = 0;
    while (changeDue >= denomValue && amount > 0) {
      changeDue -= denomValue;
      changeDue = parseFloat(changeDue.toFixed(2));
      amount -= denomValue;
      denomAmount += denomValue;
    }
    if (denomAmount > 0) {
      change.push([denom, parseFloat(denomAmount.toFixed(2))]);
    }
  }

  let remainingChange = parseFloat(changeDue.toFixed(2));
  return remainingChange === 0 ? change : null;
}

// Helper function to format change array
function formatChangeArray(change) {
  return change
    .filter(([denom, amount]) => amount > 0)
    .map(([denom, amount]) => `${denom}: $${amount}`)
    .join(' ');
}