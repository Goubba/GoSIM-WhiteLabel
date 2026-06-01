import { Injectable } from '@angular/core';
import { AppStoreService } from './app-store.service';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  constructor(private appStore: AppStoreService) {}

  currencyFormatter(val: number): string {
    const currency = this.appStore.preferences.currency?.toUpperCase() || 'DZD';
    const decimals = currency === 'DZD' ? 0 : 2;
    const data = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(val);

    const isArabic = sessionStorage.getItem('lang') === 'ar';
    const displayCurrency = (currency === 'DZD' && isArabic) ? 'د.ج' : currency;

    return `${data} ${displayCurrency}`;
  }

  dateFormatterWithTime(val: string): string {
    return new Date(val).toLocaleDateString('fr-fr', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    });
  }

  dateFormatterShort(val: string): string {
    return new Date(val).toLocaleDateString('fr-fr', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    });
  }

  formatBytes(bytes: number, locale?: string): string {
    if (!bytes) return '';
    const mb = bytes / (1024 * 1024);
    const isArabic = (locale || this.appStore.preferences.language) === 'ar';

    if (mb > 1000) {
      const gb = (mb / 1024).toFixed(0);
      return isArabic ? `\u202D${gb} GB\u202C` : `${gb} GB`;
    } else {
      const mbValue = mb.toFixed(0);
      return isArabic ? `\u202D${mbValue} MB\u202C` : `${mbValue} MB`;
    }
  }
}
