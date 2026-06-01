import { Injectable } from '@angular/core';

export type Locale = 'fr' | 'en' | 'ar';

@Injectable({
  providedIn: 'root'
})
export class AppStoreService {
  preferences = {
    currency: 'dzd',
    language: 'fr',
  };

  setLanguage(lang: string) {
    this.preferences.language = lang;
  }

  setCurrency(curr: string) {
    this.preferences.currency = curr.toLowerCase();
  }

  updateCurrency(curr: string) {
    this.setCurrency(curr);
  }

  initializePreferences() {}
  setUserData() {}
  clearUserData() {}
  initializeAuth() {}
}
