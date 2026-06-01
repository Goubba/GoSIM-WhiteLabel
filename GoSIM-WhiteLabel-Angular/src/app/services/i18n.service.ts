import { Injectable } from '@angular/core';
import { en } from '../locales/en';
import { fr } from '../locales/fr';
import { ar } from '../locales/ar';

type Locale = 'en' | 'fr' | 'ar';

const messages: Record<Locale, any> = { en, fr, ar };

@Injectable({
  providedIn: 'root'
})
export class I18nService {
  private _locale: Locale = 'fr';

  get locale(): Locale {
    return this._locale;
  }

  set locale(val: Locale) {
    this._locale = val;
  }

  t(key: string, params?: Record<string, any>): string {
    const keys = key.split('.');
    let result: any = messages[this._locale];
    for (const k of keys) {
      if (result && typeof result === 'object' && k in result) {
        result = result[k];
      } else {
        // fallback to fr
        let fallback: any = messages['fr'];
        for (const fk of keys) {
          if (fallback && typeof fallback === 'object' && fk in fallback) {
            fallback = fallback[fk];
          } else {
            return key;
          }
        }
        return this.interpolate(typeof fallback === 'string' ? fallback : key, params);
      }
    }
    return this.interpolate(typeof result === 'string' ? result : key, params);
  }

  private interpolate(str: string, params?: Record<string, any>): string {
    if (!params) return str;
    return str.replace(/\{(\w+)\}/g, (_, key) => (params[key] !== undefined ? String(params[key]) : `{${key}}`));
  }
}
