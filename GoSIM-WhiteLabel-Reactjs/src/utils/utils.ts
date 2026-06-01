export const currencyFormatter = (val: number, currency: string = 'DZD'): string => {
  const curr = currency.toUpperCase();
  const decimals = curr === 'DZD' ? 0 : 2;
  const data = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(val);

  const isArabic = sessionStorage.getItem('language') === 'ar';
  const displayCurrency = (curr === 'DZD' && isArabic) ? 'د.ج' : curr;

  return `${data} ${displayCurrency}`;
};

export const dateFormatterWithTime = (val: string): string => {
  if (!val) return '';
  return new Date(val).toLocaleDateString('fr-fr', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  });
};

export const dateFormatterShort = (val: string): string => {
  if (!val) return '';
  return new Date(val).toLocaleDateString('fr-fr', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  });
};

export const formatBytes = (bytes: number, language: string = 'en'): string => {
  if (!bytes) return '';
  const mb = bytes / (1024 * 1024);
  const isArabic = language === 'ar';

  if (mb > 1000) {
    const gb = (mb / 1024).toFixed(0);
    return isArabic ? `\u202D${gb} GB\u202C` : `${gb} GB`;
  } else {
    const mbValue = mb.toFixed(0);
    return isArabic ? `\u202D${mbValue} MB\u202C` : `${mbValue} MB`;
  }
};
