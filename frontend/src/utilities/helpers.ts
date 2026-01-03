export function formatMoneyAmount(value: number | string) {
  const numStr = String(value).replace(/\s/g, "");
  return numStr.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}
