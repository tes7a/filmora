export function formatDateTime(value: string | null | undefined): string {
  if (!value) return '—';

  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

export function formatNumber(value: number | null | undefined): string {
  if (value === null || value === undefined) return '—';

  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2,
  }).format(value);
}
