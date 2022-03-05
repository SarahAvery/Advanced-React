export default function formatMoney(amount = 0) {
  const options = {
    style: 'currency',
    currency: 'CAD',
    minimumFractionDidgits: 2,
  };

  if (amount % 100 === 0) {
    options.minimumFractionDidgits = 0;
  }

  const formatter = Intl.NumberFormat('en-CA', options);

  return formatter.format(amount / 100);
}
