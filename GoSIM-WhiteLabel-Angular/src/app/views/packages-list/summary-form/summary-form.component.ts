import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { NgIf, NgFor, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '../../../pipes/translate.pipe';
import { UtilsService } from '../../../services/utils.service';

@Component({
  selector: 'app-summary-form',
  standalone: true,
  imports: [NgIf, NgFor, NgClass, FormsModule, TranslatePipe],
  template: `
    <div class="bg-gray-50 border border-gray-100 rounded-3xl p-4 md:p-6">
      <h3 class="hidden md:block text-lg font-bold text-gray-900 mb-5">{{ 'orders.summary' | t }}</h3>

      <form *ngIf="selectedPackage?.id" class="md:space-y-2" (ngSubmit)="submitOrder()">
        <!-- Selected Package Specs -->
        <div class="hidden md:flex items-center gap-4 bg-white border border-gray-100 p-4 rounded-2xl">
          <img [src]="location?.image" class="w-11 h-11 object-cover rounded-full" />
          <div>
            <p class="font-bold text-sm text-gray-900">{{ location?.name }}</p>
            <p class="text-xs text-gray-500 font-medium mt-0.5">
              {{ selectedPackage?.duration === 1 ? ('plans.duration.unlimitedData' | t) + ' ' + utils.formatBytes(selectedPackage?.volume) : utils.formatBytes(selectedPackage?.volume) }}
            </p>
          </div>
        </div>

        <!-- Quantity Modifier -->
        <div [ngClass]="['md:flex', step === 1 ? 'flex' : 'hidden']"
          class="items-center justify-between pt-1 pb-2 md:pt-3 md:pb-6 border-b border-gray-200/50">
          <span class="text-sm font-bold text-gray-700">{{ 'orders.quantity' | t }}</span>
          <div class="flex items-center gap-3">
            <button type="button"
              class="w-8 h-8 border border-gray-300 rounded-xl flex items-center justify-center bg-white hover:bg-gray-50 text-gray-600 transition-colors"
              (click)="quantity > 1 ? quantityChange.emit(quantity - 1) : null">
              <i class="fa-solid fa-minus text-xs"></i>
            </button>
            <span class="font-black text-base w-6 text-center text-gray-900">{{ quantity }}</span>
            <button type="button"
              class="w-8 h-8 border border-gray-300 rounded-xl flex items-center justify-center bg-white hover:bg-gray-50 text-gray-600 transition-colors"
              (click)="quantityChange.emit(quantity + 1)">
              <i class="fa-solid fa-plus text-xs"></i>
            </button>
          </div>
        </div>

        <!-- Days Modifier -->
        <div *ngIf="selectedPackage?.duration === 1"
          class="hidden md:flex items-center justify-between pt-3 pb-6 border-b border-gray-200/50">
          <span class="text-sm font-bold text-gray-700">{{ days === 1 ? ('plans.duration.day' | t) : ('orders.days' | t) }}</span>
          <div class="flex items-center gap-3">
            <button type="button"
              class="size-8 border border-gray-300 rounded-xl flex items-center justify-center bg-white hover:bg-gray-50 text-gray-600 transition-colors"
              (click)="days > 1 ? daysChange.emit(days - 1) : null">
              <i class="fa-solid fa-minus text-xs"></i>
            </button>
            <span class="font-black text-base w-6 text-center text-gray-900">{{ days }}</span>
            <button type="button"
              class="size-8 border border-gray-300 rounded-xl flex items-center justify-center bg-white hover:bg-gray-50 text-gray-600 transition-colors"
              (click)="days < 30 ? daysChange.emit(days + 1) : null">
              <i class="fa-solid fa-plus text-xs"></i>
            </button>
          </div>
        </div>

        <!-- Subtotal -->
        <div class="hidden md:flex items-center justify-between pt-3 pb-6 border-b border-gray-200/50">
          <span class="text-sm font-bold text-gray-700">{{ 'orders.subTotal' | t }}</span>
          <div class="flex flex-col items-end">
            <span class="font-black text-base text-gray-900">
              {{ utils.currencyFormatter(getDiscountedPrice(selectedPackage, selectedPackage?.duration === 1 ? days : 1) * quantity) }}
            </span>
            <span *ngIf="selectedPackage?.duration === 1 && getDiscount(selectedPackage, days) > 0"
              class="text-xs line-through text-gray-400">
              {{ utils.currencyFormatter(selectedPackage?.price * days * quantity) }}
            </span>
          </div>
        </div>

        <!-- Customer Form -->
        <div [ngClass]="['md:block', step === 1 ? 'hidden' : 'block']"
          class="pt-3 pb-6 md:border-b border-gray-200/50 space-y-3">
          <div class="flex items-center justify-between">
            <h4 class="text-sm font-bold text-gray-900 mb-2">{{ 'orders.billingInformation' | t }}</h4>
            <button *ngIf="step === 2" type="button" (click)="step = 1"
              class="inline-flex items-center justify-center text-gray-500 border rounded-xl border-gray-300 bg-white size-8">
              <i class="fa-solid fa-xmark text-xs"></i>
            </button>
          </div>

          <!-- Delivery Method -->
          <div>
            <label class="block text-xs font-bold text-gray-700 mb-2">{{ 'orders.deliveryMethod' | t }}</label>
            <div class="flex items-center gap-4">
              <label class="flex items-center gap-2 text-sm cursor-pointer">
                <input type="radio" [(ngModel)]="deliveryMethod" name="deliveryMethod" value="email" class="text-primary focus:ring-primary" />
                <span>{{ 'orders.email' | t }}</span>
              </label>
              <label class="flex items-center gap-2 text-sm cursor-pointer">
                <input type="radio" [(ngModel)]="deliveryMethod" name="deliveryMethod" value="whatsapp" class="text-primary focus:ring-primary" />
                <span>{{ 'orders.whatsapp' | t }}</span>
              </label>
              <label class="flex items-center gap-2 text-sm cursor-pointer">
                <input type="radio" [(ngModel)]="deliveryMethod" name="deliveryMethod" value="phone" class="text-primary focus:ring-primary" />
                <span>{{ 'orders.sms' | t }}</span>
              </label>
            </div>
          </div>

          <!-- Name -->
          <div>
            <label class="block text-xs font-bold text-gray-700 mb-1">{{ 'orders.fullName' | t }} <span class="text-red-500">*</span></label>
            <input [(ngModel)]="customer.name" name="customerName" type="text" required
              class="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              [placeholder]="'orders.namePlaceholder' | t" />
          </div>

          <!-- Email -->
          <div>
            <label class="block text-xs font-bold text-gray-700 mb-1">{{ 'orders.emailAddress' | t }} <span class="text-red-500">*</span></label>
            <input [(ngModel)]="customer.email" name="customerEmail" type="email" required
              class="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              [placeholder]="'orders.emailPlaceholder' | t" />
          </div>

          <!-- Phone (for whatsapp or phone) -->
          <div *ngIf="deliveryMethod === 'whatsapp' || deliveryMethod === 'phone'">
            <label class="block text-xs font-bold text-gray-700 mb-1">{{ 'orders.phoneNumber' | t }} <span class="text-red-500">*</span></label>
            <div class="flex gap-2">
              <select [(ngModel)]="selectedCountryCode" name="countryCode"
                class="w-24 bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50">
                <option *ngFor="let country of countries" [value]="country.code">{{ country.code }}</option>
              </select>
              <input [(ngModel)]="customer.phone" name="customerPhone" type="tel" required
                class="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                [placeholder]="'orders.phonePlaceholder' | t" pattern="[567][0-9]{8}" maxlength="9" />
            </div>
          </div>
        </div>

        <!-- Total -->
        <div class="hidden md:flex items-center justify-between pt-3 pb-6 border-gray-200/50">
          <span>{{ 'orders.total' | t }}</span>
          <div class="flex flex-col items-end">
            <span class="font-black text-lg text-gray-900">
              {{ utils.currencyFormatter(getDiscountedPrice(selectedPackage, selectedPackage?.duration === 1 ? days : 1) * quantity) }}
            </span>
            <span *ngIf="selectedPackage?.duration === 1 && getDiscount(selectedPackage, days) > 0"
              class="text-sm line-through text-gray-400">
              {{ utils.currencyFormatter(selectedPackage?.price * days * quantity) }}
            </span>
          </div>
        </div>

        <!-- Order Submission Desktop -->
        <button type="submit" class="btn-primary w-full hidden md:flex mt-4" [disabled]="loading">
          <i *ngIf="loading" class="fa-solid fa-circle-notch fa-spin"></i>
          <span *ngIf="!loading">{{ 'orders.placeOrder' | t }}</span>
        </button>

        <!-- Mobile Actions -->
        <button *ngIf="step === 1" type="button" (click)="step = 2" class="btn-primary w-full md:hidden mt-2">
          {{ 'common.continue' | t }}
        </button>
        <button *ngIf="step === 2" type="submit" class="btn-primary w-full md:hidden mt-2" [disabled]="loading">
          <i *ngIf="loading" class="fa-solid fa-circle-notch fa-spin"></i>
          <span *ngIf="!loading">{{ 'orders.placeOrder' | t }} {{ utils.currencyFormatter(getDiscountedPrice(selectedPackage, selectedPackage?.duration === 1 ? days : 1) * quantity) }}</span>
        </button>

        <!-- Exclusive notice -->
        <p class="text-[11px] text-gray-400 font-semibold text-center hidden md:block mt-2">
          {{ 'orders.appExclusiveRates' | t }}
        </p>
      </form>

      <!-- Empty State -->
      <div *ngIf="!selectedPackage?.id" class="text-center py-10 text-gray-500 text-sm font-medium">
        <i class="fa-light fa-wallet text-3xl text-gray-300 mb-3 block"></i>
        {{ 'orders.emptySummaryState' | t }}
      </div>
    </div>
  `
})
export class SummaryFormComponent {
  @Input() selectedPackage: any = {};
  @Input() quantity: number = 1;
  @Input() days: number = 1;
  @Input() location: any = {};
  @Input() loading: boolean = false;

  @Output() formSubmit = new EventEmitter<any>();
  @Output() quantityChange = new EventEmitter<number>();
  @Output() daysChange = new EventEmitter<number>();

  step = 1;
  deliveryMethod = 'email';
  customer = { name: '', email: '', phone: '', whatsapp: '' };
  selectedCountryCode = '+213';
  countries = [{ code: '+213', name: 'Algeria' }];

  constructor(public utils: UtilsService) {}

  getDiscount(pack: any, days: number): number {
    if (!pack?.daily_discounts?.length) return 0;
    const applicable = pack.daily_discounts.filter((d: any) => days >= d.day);
    if (applicable.length > 0) {
      return Math.max(...applicable.map((d: any) => d.discount));
    }
    return 0;
  }

  getDiscountedPrice(pack: any, days: number): number {
    if (!pack) return 0;
    const total = pack.price * days;
    const discount = this.getDiscount(pack, days);
    return total * (1 - discount / 100);
  }

  submitOrder() {
    const payload: any = {
      name: this.customer.name,
      email: this.customer.email,
    };

    if (this.deliveryMethod === 'phone') {
      payload.phone = this.selectedCountryCode + this.customer.phone;
    } else if (this.deliveryMethod === 'whatsapp') {
      payload.whatsapp = this.selectedCountryCode + this.customer.phone;
    }

    this.formSubmit.emit(payload);
  }
}
