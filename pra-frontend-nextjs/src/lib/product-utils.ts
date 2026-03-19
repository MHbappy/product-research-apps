export function formatCompactNumber(value: number) {
  return value >= 1000
    ? `${(value / 1000).toLocaleString(undefined, { maximumFractionDigits: 1 })}k`
    : `${value}`;
}

export function getBounds(values: number[]) {
  if (!values.length) return { min: 0, max: 0 };

  return {
    min: Math.min(...values),
    max: Math.max(...values)
  };
}

export function average(values: number[]) {
  if (!values.length) return 0;
  return values.reduce((sum, n) => sum + n, 0) / values.length;
}
