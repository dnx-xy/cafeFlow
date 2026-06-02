export const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar', locale: 'en-US' },
  { code: 'IDR', symbol: 'Rp', name: 'Indonesian Rupiah', locale: 'id-ID' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', locale: 'en-SG' },
  { code: 'MYR', symbol: 'RM', name: 'Malaysian Ringgit', locale: 'ms-MY' },
  { code: 'THB', symbol: '฿', name: 'Thai Baht', locale: 'th-TH' },
  { code: 'PHP', symbol: '₱', name: 'Philippine Peso', locale: 'en-PH' },
  { code: 'VND', symbol: '₫', name: 'Vietnamese Dong', locale: 'vi-VN' },
  { code: 'KRW', symbol: '₩', name: 'South Korean Won', locale: 'ko-KR' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen', locale: 'ja-JP' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan', locale: 'zh-CN' },
  { code: 'EUR', symbol: '€', name: 'Euro', locale: 'de-DE' },
  { code: 'GBP', symbol: '£', name: 'British Pound', locale: 'en-GB' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', locale: 'en-AU' },
] as const;

export type CurrencyCode = (typeof CURRENCIES)[number]['code'];

const currencyMap = new Map<string, typeof CURRENCIES[number]>(CURRENCIES.map(c => [c.code, c]));

export function getCurrencyInfo(code: string) {
  return currencyMap.get(code) || currencyMap.get('USD')!;
}

export function formatCurrency(amount: number, code: string = 'USD'): string {
  const info = getCurrencyInfo(code);
  try {
    return new Intl.NumberFormat(info.locale, {
      style: 'currency',
      currency: code,
      minimumFractionDigits: code === 'VND' || code === 'JPY' || code === 'KRW' ? 0 : 2,
      maximumFractionDigits: code === 'VND' || code === 'JPY' || code === 'KRW' ? 0 : 2,
    }).format(amount);
  } catch {
    return `${info.symbol}${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
}
