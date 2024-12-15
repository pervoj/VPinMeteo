export function formatNumber(value: number) {
  return value.toLocaleString("cs-CZ", {
    maximumFractionDigits: 1,
  });
}
