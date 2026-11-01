export function formatPrice(amount: number) {
  return `Rs. ${amount.toLocaleString("en-PK", { minimumFractionDigits: 0 })}`;
}
