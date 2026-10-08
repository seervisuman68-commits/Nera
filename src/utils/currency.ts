/**
 * Utility to format amounts in Indian Rupee (₹) with Indian numbering style (e.g. ₹1,00,000)
 */
export function formatINR(amount: number | undefined | null): string {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return '₹0';
  }
  return '₹' + Number(amount).toLocaleString('en-IN', {
    maximumFractionDigits: 2,
    minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
  });
}

/**
 * Format hourly wage rate (e.g. ₹350/hr)
 */
export function formatHourlyINR(rate: number | undefined | null): string {
  return `${formatINR(rate)}/hr`;
}
