import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgIf, NgClass } from '@angular/common';
import { Router } from '@angular/router';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { I18nService } from '../../services/i18n.service';
import { AppStoreService } from '../../services/app-store.service';

@Component({
  selector: 'app-default-page-header',
  standalone: true,
  imports: [NgIf, NgClass, TranslatePipe],
  template: `
    <div class="md:hidden sticky top-0 inset-x-0 bg-white z-50 px-2 max-w-lg mx-auto">
      <div [class]="classes" class="pb-2 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <button *ngIf="showArrow" (click)="goBack()">
            <i class="fa-solid fa-angle-left text-2xl text-black"
               [ngClass]="i18n.locale === 'ar' ? 'rotate-180' : ''"></i>
          </button>
          <h1 class="text-xl font-bold">{{ title }}</h1>
        </div>
        <div class="flex items-center gap-1">
          <!-- Currency Display -->
          <button *ngIf="showCurrency && currencyCode && currencySymbol" (click)="openCurrencyModal()"
            class="text-gray-500 text-xs font-bold bg-gray-100 rounded-full px-2 py-2 hover:bg-gray-200 transition-colors">
            {{ currencySymbol + ' - ' + currencyCode }} <i class="fa-solid fa-chevron-down text-[10px]"></i>
          </button>
          <ng-content select="[header-action]"></ng-content>
        </div>
      </div>
    </div>

    <!-- Currency Selection Modal -->
    <div *ngIf="showCurrencyModal" class="fixed inset-0 z-50 flex items-end justify-center">
      <div class="absolute inset-0 bg-black/50" (click)="showCurrencyModal = false"></div>
      <div class="relative bg-white rounded-t-3xl w-full max-w-md mx-auto" style="min-height: 40vh;">
        <div class="flex flex-col gap-4 py-6 px-6">
          <div class="flex items-start justify-between">
            <h2 class="text-xl font-extrabold">{{ 'common.selectCurrency' | t }}</h2>
            <button (click)="showCurrencyModal = false"
              [ngClass]="i18n.locale === 'ar' ? 'absolute md:static top-4 left-4' : 'absolute md:static top-4 right-4'">
              <i class="fa-solid fa-circle-xmark text-black text-3xl"></i>
            </button>
          </div>
          <div class="space-y-3">
            <button *ngFor="let currency of availableCurrencies" (click)="selectCurrency(currency)"
              class="w-full p-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-between"
              [ngClass]="currentCurrency === currency.code ? 'border-primary bg-red-50' : 'border-gray-200 bg-white hover:border-gray-300'">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  <img [src]="currency.image" [alt]="currency.name" class="w-8 h-8">
                </div>
                <div class="text-left">
                  <p class="font-bold text-lg text-gray-900">{{ currency.name }}</p>
                  <p class="text-base text-gray-500">{{ currency.code }}</p>
                </div>
              </div>
              <div class="w-5 h-5 rounded-full border-2 flex items-center justify-center"
                [ngClass]="currentCurrency === currency.code ? 'border-primary bg-primary' : 'border-gray-300'">
                <div *ngIf="currentCurrency === currency.code" class="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DefaultPageHeaderComponent {
  @Input() title: string = '';
  @Input() showArrow: boolean = true;
  @Input() backRoute: string | null = null;
  @Input() customBackAction: (() => void) | null = null;
  @Input() classes: string = 'flex items-center gap-3';
  @Input() showCurrency: boolean = false;
  @Input() currencyCode: string = '';
  @Input() currencySymbol: string = '';
  @Output() currencyChanged = new EventEmitter<string>();

  showCurrencyModal = false;

  availableCurrencies = [
    { code: 'DZD', name: 'Algerian Dinar', symbol: 'دج', image: '/assets/dzd.png' },
    { code: 'USD', name: 'US Dollar', symbol: '$', image: '/assets/usd.png' },
  ];

  constructor(
    public i18n: I18nService,
    private router: Router,
    private appStore: AppStoreService
  ) {}

  get currentCurrency(): string {
    return this.appStore.preferences.currency?.toUpperCase() || 'DZD';
  }

  goBack() {
    if (this.customBackAction) {
      this.customBackAction();
    } else if (this.backRoute) {
      this.router.navigate([this.backRoute]);
    } else {
      window.history.back();
    }
  }

  openCurrencyModal() {
    this.showCurrencyModal = true;
  }

  selectCurrency(currency: any) {
    this.appStore.updateCurrency(currency.code.toLowerCase());
    this.currencyChanged.emit(currency.code);
    this.showCurrencyModal = false;
  }
}
