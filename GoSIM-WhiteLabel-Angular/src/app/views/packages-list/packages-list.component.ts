import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { NgIf, NgFor, NgClass } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { HttpService } from '../../services/http.service';
import { UtilsService } from '../../services/utils.service';
import { IndexService } from '../../services/index.service';
import { AppStoreService } from '../../services/app-store.service';
import { SummaryFormComponent } from './summary-form/summary-form.component';
import Swal from 'sweetalert2';
import { I18nService } from '../../services/i18n.service';

@Component({
  selector: 'app-packages-list',
  standalone: true,
  imports: [NgIf, NgFor, NgClass, RouterLink, TranslatePipe, SummaryFormComponent],
  template: `
    <!-- Loading State -->
    <div *ngIf="loading" class="flex items-center justify-center min-h-screen">
      <div class="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
    </div>

    <!-- Main View -->
    <div *ngIf="!loading" class="space-y-4 grid md:grid-cols-2 lg:grid-cols-3 gap-4 pb-32 md:pb-4">
      <!-- Left Column: Packages and Information -->
      <div class="lg:col-span-2 space-y-4 min-w-0">
        <!-- Back to Search Link -->
        <a routerLink="/" class="inline-flex items-center gap-2 text-sm text-gray-500 font-medium">
          <i class="fa-solid fa-arrow-left text-xs"></i>
          <span>{{ 'navigation.home' | t }}</span>
        </a>

        <!-- Location Header Banner -->
        <div class="space-y-2">
          <div class="flex items-center gap-5 bg-gray-50/50 border border-gray-100 rounded-3xl p-6">
            <img [src]="location.image" class="w-16 h-16 object-cover rounded-full border border-white shrink-0" />
            <div class="min-w-0 flex-1">
              <h1 class="text-2xl font-black text-gray-900 truncate">{{ location.name }}</h1>
              <div class="flex gap-2 overflow-x-auto w-full mt-1.5 pb-1 no-scrollbar">
                <ng-container *ngFor="let network of networks">
                  <span *ngFor="let operator of network.operatorList"
                    class="bg-gray-100 py-1 px-3 border border-gray-200 rounded-full text-xs font-semibold text-gray-600 shrink-0 whitespace-nowrap">
                    {{ operator.operatorName }} {{ operator.networkType }}
                  </span>
                </ng-container>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-3 gap-2">
            <div class="bg-gray-50 border border-gray-100 rounded-2xl p-4 flex flex-col items-center text-center gap-2">
              <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <i class="fa-light fa-gauge-max text-lg"></i>
              </div>
              <p class="text-xs font-semibold text-gray-700">{{ 'plans.planDetailTwo' | t }}</p>
            </div>
            <div class="bg-gray-50 border border-gray-100 rounded-2xl p-4 flex flex-col items-center text-center gap-2">
              <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <i class="fa-light fa-signal-stream text-lg"></i>
              </div>
              <p class="text-xs font-semibold text-gray-700">{{ 'plans.planDetailThree' | t }}</p>
            </div>
            <div class="bg-gray-50 border border-gray-100 rounded-2xl p-4 flex flex-col items-center text-center gap-2">
              <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <i class="fa-light fa-globe text-lg"></i>
              </div>
              <p class="text-xs font-semibold text-gray-700">{{ 'plans.supportedNetwork' | t }}</p>
            </div>
          </div>
        </div>

        <!-- Plans Segment -->
        <div>
          <h3 class="text-lg font-bold text-gray-900">{{ 'plans.plansTitle' | t }}</h3>
          <p class="text-sm text-gray-600">{{ 'plans.plansText' | t }}</p>

          <!-- Duration Category Badges -->
          <div class="flex my-4 rounded-2xl bg-gray-100">
            <button *ngIf="unlimitedPackages.length > 0" (click)="type = 'unlimited'"
              class="w-full py-2 rounded-2xl font-bold text-center cursor-pointer"
              [ngClass]="type === 'unlimited' ? 'bg-primary text-white' : ''">
              {{ 'plans.duration.unlimited' | t }}
            </button>
            <button *ngIf="fixedPackages.length > 0" (click)="type = 'fixed'"
              class="w-full py-2 rounded-2xl font-bold text-center cursor-pointer"
              [ngClass]="type === 'fixed' ? 'bg-primary text-white' : ''">
              {{ 'plans.fixedPlans' | t }}
            </button>
          </div>

          <!-- Packages Listing Grid -->
          <div class="grid gap-4">
            <div *ngFor="let pack of (type === 'unlimited' ? unlimitedPackages : fixedPackages)"
              (click)="selectedPackage = pack"
              class="border-2 rounded-2xl p-5 cursor-pointer transition-all duration-200 group hover:border-primary select-none"
              [ngClass]="selectedPackage?.id === pack.id ? 'border-primary' : 'border-gray-200'">
              <div class="flex justify-between items-center">
                <div class="flex items-center gap-4">
                  <!-- Check Indicator -->
                  <div class="w-5.5 h-5.5 rounded-full border flex items-center justify-center shrink-0"
                    [ngClass]="selectedPackage?.id === pack.id ? 'border-primary bg-primary text-white' : 'border-gray-300'">
                    <i *ngIf="selectedPackage?.id === pack.id" class="fa-solid fa-check text-[10px]"></i>
                  </div>
                  <div>
                    <h4 class="font-bold text-lg text-gray-900 group-hover:text-primary"
                      [ngClass]="selectedPackage?.id === pack.id ? 'text-primary' : ''">
                      {{ pack.duration === 1 ? utils.formatBytes(pack.volume) + ' ' + ('plans.duration.unlimitedData' | t) : utils.formatBytes(pack.volume) }}
                    </h4>
                    <p class="text-xs text-gray-500 font-medium mt-0.5">
                      {{ pack.duration === 1 ? ('plans.duration.perDay' | t) : ('plans.duration.days' | t:{count: pack.duration}) }}
                    </p>
                  </div>
                </div>
                <div class="text-right flex flex-col items-end">
                  <span class="font-black text-xl text-gray-900">
                    {{ selectedPackage?.id === pack.id && pack.duration === 1 ? utils.currencyFormatter(getDiscountedPrice(pack, days)) : utils.currencyFormatter(pack.price) }}
                  </span>
                  <span *ngIf="selectedPackage?.id === pack.id && pack.duration === 1 && getDiscount(pack, days) > 0"
                    class="text-sm text-gray-400 line-through mt-0.5">
                    {{ utils.currencyFormatter(pack.price * days) }}
                  </span>
                </div>
              </div>

              <!-- Day modifier on mobile inside card -->
              <div *ngIf="selectedPackage?.id === pack.id && selectedPackage?.duration === 1"
                class="md:hidden flex justify-between items-center pb-0 border-t-[0.5px] pt-4 mt-4 border-primary">
                <button type="button" (click)="$event.stopPropagation(); decreaseDays()" [disabled]="days === 1" class="py-1 px-6">
                  <i class="fa-solid fa-minus text-lg"></i>
                </button>
                <span>{{ days }} {{ days === 1 ? ('plans.duration.day' | t) : ('orders.days' | t) }}</span>
                <button type="button" (click)="$event.stopPropagation(); increaseDays()" [disabled]="days === 30" class="py-1 px-6">
                  <i class="fa-solid fa-plus text-lg"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column: Desktop Summary -->
      <div class="w-full lg:sticky lg:top-24 self-start hidden md:block">
        <app-summary-form
          [selectedPackage]="selectedPackage"
          [quantity]="quantity"
          [days]="days"
          [location]="location"
          [loading]="paymentLoading"
          (quantityChange)="quantity = $event"
          (daysChange)="days = $event"
          (formSubmit)="submit($event)">
        </app-summary-form>
      </div>
    </div>

    <!-- Mobile Bottom Summary -->
    <div *ngIf="!loading" class="fixed bottom-0 inset-x-0 md:hidden z-50">
      <app-summary-form
        [selectedPackage]="selectedPackage"
        [quantity]="quantity"
        [days]="days"
        [location]="location"
        [loading]="paymentLoading"
        (quantityChange)="quantity = $event"
        (daysChange)="days = $event"
        (formSubmit)="submit($event)">
      </app-summary-form>
    </div>
  `
})
export class PackagesListComponent implements OnInit, OnDestroy {
  loading = false;
  paymentLoading = false;
  selectedPackage: any = {};
  location: any = {};
  packages: any[] = [];
  quantity = 1;
  days = 1;

  private langSub: any;

  constructor(
    private http: HttpService,
    public utils: UtilsService,
    private indexService: IndexService,
    private appStore: AppStoreService,
    private i18n: I18nService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.langSub = this.i18n.locale$.subscribe(() => {
      this.getPackages();
    });
  }

  ngOnDestroy() {
    if (this.langSub) {
      this.langSub.unsubscribe();
    }
  }

  decreaseDays() {
    if (this.days > 1) {
      this.days--;
    }
  }

  increaseDays() {
    if (this.days < 30) {
      this.days++;
    }
  }

  get currentCurrency(): string {
    return this.appStore.preferences.currency?.toUpperCase() || 'DZD';
  }

  get unlimitedPackages(): any[] {
    return this.packages.filter(pkg => pkg.duration === 1);
  }

  get fixedPackages(): any[] {
    return this.packages.filter(pkg => pkg.duration > 1);
  }

  get networks(): any[] {
    return this.packages?.[0]?.locationNetworkList || [];
  }

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

  onTypeChange(value: string) {
    this.type = value;
    if (value === 'unlimited') {
      this.selectedPackage = this.unlimitedPackages[0] || null;
    } else {
      this.selectedPackage = this.fixedPackages[0] || null;
    }
  }

  set type(value: string) {
    this._type = value;
    if (value === 'unlimited') {
      this.selectedPackage = this.unlimitedPackages[0] || null;
    } else {
      this.selectedPackage = this.fixedPackages[0] || null;
    }
  }

  get type(): string {
    return this._type;
  }

  private _type = '';

  submit(customer: any) {
    this.paymentLoading = true;
    try {
      this.indexService.setPendingOrderData({
        location: this.location,
        packageData: this.selectedPackage
      });

      const currentCurrency = this.appStore.preferences.currency?.toUpperCase() || 'DZD';

      const orderData = {
        package: this.selectedPackage.id,
        quantity: this.quantity,
        days: this.selectedPackage.duration === 1 ? this.days : null,
        payment_method: 5,
        promo_codes: [],
        currency: currentCurrency.toUpperCase(),
        email: customer.email,
        name: customer.name,
        phone: customer.phone || customer.whatsapp,
        country: 'DZ',
        country_phone_code: customer.country_phone_code,
        delivery: customer
      };

      this.http.post('/order/initiate/unauth/external', orderData)
        .then((response: any) => {
          const paymentId = response.data?.data?.data?.payment?.id;
          this.router.navigate(['/status', paymentId], { queryParams: { status: 'success' } });
        })
        .catch((error: any) => {
          console.error('Payment initiation error:', error);
          Swal.fire({
            icon: 'error',
            title: this.i18n.t('fail.operationFailed'),
            text: this.i18n.t('fail.tryAgainLater')
          });
          this.cdr.detectChanges();
        })
        .finally(() => {
          this.paymentLoading = false;
          this.cdr.detectChanges();
        });
    } catch (error) {
      console.error('Payment initiation error:', error);
      Swal.fire({
        icon: 'error',
        title: this.i18n.t('fail.operationFailed'),
        text: this.i18n.t('fail.tryAgainLater')
      });
      this.paymentLoading = false;
    }
  }

  getPackages() {
    this.loading = true;
    this.cdr.detectChanges();
    const code = this.route.snapshot.params['code'];
    this.http.post('/packages', {
      code,
      currency: this.currentCurrency.toLowerCase()
    })
      .then(({ data }: any) => {
        this.loading = false;
        this.packages = data.data.packages || [];
        this.location = data.data.location || {};

        if (this.unlimitedPackages.length > 0) {
          this._type = 'unlimited';
        } else {
          this._type = 'fixed';
        }

        const availablePackages = this._type === 'unlimited' ? this.unlimitedPackages : this.fixedPackages;
        this.selectedPackage = availablePackages.length > 0 ? availablePackages[0] : null;
        this.cdr.detectChanges();
      })
      .catch(() => {
        this.loading = false;
        this.cdr.detectChanges();
      });
  }
}
