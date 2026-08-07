/**
 * Utility to format numerical amounts into Indian Rupee (INR) currency format.
 * Examples:
 *  50000 -> ₹50,000
 *  125000 -> ₹1,25,000
 *  1250000 -> ₹12,50,000
 *
 * @param {number|string} amount
 * @returns {string} Formatted INR currency string
 */
export const formatCurrency = (amount) => {
  const num = Number(amount);
  if (isNaN(num) || amount === null || amount === undefined) {
    return '₹0';
  }

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(num);
};

export default formatCurrency;
