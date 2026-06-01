import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DesktopFooterComponent } from './components/desktop-footer/desktop-footer.component';
import { I18nService } from './services/i18n.service';
import { IndexService } from './services/index.service';
import { AppStoreService } from './services/app-store.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, NgIf, NgFor, FormsModule, DesktopFooterComponent],
  template: `
    <!-- Desktop Header Navbar -->
    <header *ngIf="showHeader"
      class="hidden md:block py-3 px-4 bg-white sticky top-0 inset-x-0 z-50 border-b border-gray-200">
      <nav class="flex items-center justify-between max-w-6xl mx-auto">
        <!-- Logo -->
        <div class="flex items-center">
          <a routerLink="/" class="flex items-center">
            <img src="/assets/logo.png" alt="GoSIM" class="h-10 w-auto" />
          </a>
        </div>
        <div class="flex items-center justify-between gap-2">
          <!-- Desktop Navigation Menu -->
          <div class="hidden md:flex items-center space-x-5 font-medium">
          </div>
          <!-- Language Selector -->
          <select [ngModel]="currentLanguage" (ngModelChange)="selectLanguage($event)"
            class="bg-transparent border-none outline-none focus:ring-0 cursor-pointer pr-1 text-xs py-2">
            <option *ngFor="let lang of languages" [value]="lang.code">
              {{ lang.icon }} {{ lang.name }}
            </option>
          </select>
        </div>
      </nav>
    </header>

    <!-- Main Content -->
    <main class="max-w-6xl mx-auto p-4">
      <router-outlet />
    </main>

    <!-- Desktop Footer -->
    <app-desktop-footer *ngIf="showFooter"></app-desktop-footer>
  `
})
export class App implements OnInit {
  loading = false;

  languages = [
    { code: 'ar', name: 'العربية', icon: '🇩🇿' },
    { code: 'fr', name: 'Français', icon: '🇫🇷' },
    { code: 'en', name: 'English', icon: '🇺🇸' },
  ];

  constructor(
    public i18n: I18nService,
    private indexService: IndexService,
    private appStore: AppStoreService
  ) {
    this.parseQueryParams();
  }

  get showHeader(): boolean {
    return this.indexService.header;
  }

  get showFooter(): boolean {
    return this.indexService.footer;
  }

  get currentLanguage(): string {
    return this.i18n.locale;
  }

  private parseQueryParams() {
    const urlParams = new URLSearchParams(window.location.search);

    if (urlParams.has('language')) {
      const lang = urlParams.get('language') as any;
      if (['ar', 'en', 'fr'].includes(lang)) {
        this.selectLanguage(lang);
      }
    }
    if (urlParams.has('api-key')) {
      this.indexService.setPublicKey(urlParams.get('api-key')!);
    }
    if (urlParams.has('header')) {
      this.indexService.setHeader(urlParams.get('header')!);
    }
    if (urlParams.has('footer')) {
      this.indexService.setFooter(urlParams.get('footer')!);
    }
    if (urlParams.has('color')) {
      this.indexService.setColor(urlParams.get('color'));
    } else if (this.indexService.color) {
      this.indexService.setColor(this.indexService.color);
    }
    if (urlParams.has('host')) {
      this.indexService.setHost(urlParams.get('host')!);
    }
    if (urlParams.has('currency')) {
      const curr = urlParams.get('currency')!;
      this.indexService.setCurrency(curr);
      this.appStore.updateCurrency(curr.toLowerCase());
    }
  }

  ngOnInit() {
    this.appStore.initializePreferences();

    // Set initial lang/dir from stored locale
    const initialLocale = this.i18n.locale;
    const langAttribute = initialLocale === 'ar' ? 'ar-DZ' : initialLocale === 'en' ? 'en-US' : 'fr-DZ';
    document.documentElement.setAttribute('lang', langAttribute);
    if (initialLocale === 'ar') {
      document.documentElement.setAttribute('dir', 'rtl');
      document.body.classList.add('arabic-lang');
    } else {
      document.documentElement.setAttribute('dir', 'ltr');
      document.body.classList.remove('arabic-lang');
    }
  }

  selectLanguage(languageCode: string) {
    try {
      this.loading = true;
      this.appStore.setLanguage(this.getLanguageName(languageCode));
      this.indexService.setLang(languageCode);
      this.i18n.locale = languageCode as any;

      // Update URL query parameter 'language' to match newly selected language code
      const url = new URL(window.location.href);
      url.searchParams.set('language', languageCode);
      window.history.replaceState({}, '', url.toString());

      const langAttribute = languageCode === 'ar' ? 'ar-DZ' : languageCode === 'en' ? 'en-US' : 'fr-DZ';
      document.documentElement.setAttribute('lang', langAttribute);

      if (languageCode === 'ar') {
        document.documentElement.setAttribute('dir', 'rtl');
        document.body.classList.add('arabic-lang');
      } else {
        document.documentElement.setAttribute('dir', 'ltr');
        document.body.classList.remove('arabic-lang');
      }
    } catch (error) {
      console.error('Error updating language:', error);
    } finally {
      this.loading = false;
    }
  }

  private getLanguageName(code: string): string {
    const map: Record<string, string> = { ar: 'arabic', en: 'english', fr: 'french' };
    return map[code] || 'english';
  }
}
