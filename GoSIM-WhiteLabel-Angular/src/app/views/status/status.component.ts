import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { HttpService } from '../../services/http.service';
import { UtilsService } from '../../services/utils.service';

@Component({
  selector: 'app-status',
  standalone: true,
  imports: [NgIf, NgFor, RouterLink, TranslatePipe],
  template: `
    <!-- Loading State -->
    <div *ngIf="loading" class="flex items-center justify-center min-h-screen">
      <div class="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent"></div>
    </div>

    <ng-container *ngIf="!loading">
      <!-- Header Section -->
      <div class="p-10 md:p-16 text-center relative overflow-hidden"
        [class]="isSuccess ? 'bg-gradient-to-br from-green-500 via-emerald-500 to-teal-600' : 'bg-gradient-to-br from-red-500 via-red-500 to-orange-500'">
        <!-- Glassmorphism decorative blobs -->
        <div class="absolute -top-24 -right-24 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl mix-blend-overlay"></div>
        <div class="absolute -bottom-24 -left-24 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl mix-blend-overlay"></div>

        <div class="relative z-10 w-24 h-24 md:w-32 md:h-32 mx-auto mb-6 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md border-[3px] border-white/40">
          <i *ngIf="isSuccess" class="fa-solid fa-check text-5xl md:text-6xl text-white"></i>
          <i *ngIf="!isSuccess" class="fa-solid fa-xmark text-5xl md:text-6xl text-white"></i>
        </div>

        <h1 class="relative z-10 text-3xl md:text-4xl font-extrabold text-white mb-2 tracking-tight">
          {{ isSuccess ? ('success.title' | t) : ('failure.title' | t) }}
        </h1>
        <p class="relative z-10 text-lg md:text-xl text-white/90 font-medium">
          {{ isSuccess ? ('success.subtitle' | t) : ('failure.subtitle' | t) }}
        </p>
      </div>

      <!-- Content Section -->
      <div class="mt-6 text-center bg-white">
        <p class="text-gray-600 text-base md:text-lg mb-6 leading-relaxed max-w-lg mx-auto font-medium px-12">
          {{ isSuccess ? ('success.message' | t) : ('failure.message' | t) }}
        </p>

        <!-- Order Summary Details -->
        <div *ngIf="payment && payment.order"
          class="mb-8 p-6 bg-gray-50 rounded-2xl border border-gray-100 max-w-sm mx-auto">
          <div class="flex justify-between items-center mb-3">
            <span class="text-sm text-gray-500 font-medium">{{ 'orders.orderNumber' | t }}:</span>
            <span class="text-sm font-bold text-gray-900">{{ payment.order.batch_id }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-500 font-medium">{{ 'orders.totalAmount' | t }}:</span>
            <span class="text-sm font-bold text-gray-900">{{ payment.amount }} {{ payment.extra?.currency || 'DZD' }}</span>
          </div>
        </div>

        <!-- eSIMs Details and QR Codes -->
        <div *ngIf="isSuccess && payment?.order?.esims?.length > 0" class="mb-10 space-y-6 text-left">
          <div *ngFor="let esim of payment.order.esims"
            class="bg-gray-50 border border-gray-200 rounded-2xl p-6">
            <h3 class="font-bold text-xl text-gray-900 mb-6 border-b border-gray-200 pb-4">{{ esim.packageName || 'eSIM' }}</h3>

            <div class="flex flex-col md:flex-row gap-8 items-center md:items-start">
              <div class="bg-white p-4 rounded-2xl border border-gray-200 flex-shrink-0">
                <!-- QR code placeholder - In real implementation, use a QR code library -->
                <div *ngIf="esim.ac" class="w-[180px] h-[180px] bg-gray-100 flex items-center justify-center rounded-xl">
                  <canvas [id]="'qr-' + esim.id" class="w-full h-full"></canvas>
                </div>
                <div *ngIf="!esim.ac"
                  class="w-[180px] h-[180px] flex items-center justify-center bg-gray-100 text-gray-400 rounded-xl">
                  -
                </div>
              </div>

              <div class="flex-1 w-full space-y-4">
                <div class="bg-white p-4 rounded-xl border border-gray-100">
                  <p class="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">{{ 'scan.activationCode' | t }}</p>
                  <p class="text-sm font-mono font-semibold text-gray-900 break-all">{{ esim.ac || 'N/A' }}</p>
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div class="bg-white p-4 rounded-xl border border-gray-100">
                    <p class="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">ICCID</p>
                    <p class="text-sm font-semibold text-gray-900 break-all">{{ esim.iccid || 'N/A' }}</p>
                  </div>
                  <div class="bg-white p-4 rounded-xl border border-gray-100">
                    <p class="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">{{ 'plans.data' | t }}</p>
                    <p class="text-sm font-semibold text-gray-900">{{ esim.totalVolume ? utils.formatBytes(esim.totalVolume) : 'N/A' }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <a routerLink="/search" class="btn-primary inline-flex">
          {{ 'failure.backToHome' | t }}
        </a>
      </div>
    </ng-container>
  `
})
export class StatusViewComponent implements OnInit {
  loading = true;
  payment: any = null;
  error: string | null = null;

  constructor(
    private http: HttpService,
    public utils: UtilsService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  get isSuccess(): boolean {
    if (this.payment) {
      return this.payment.status === 'success';
    }
    return this.route.snapshot.queryParams['status'] === 'success';
  }

  async ngOnInit() {
    const paymentId = this.route.snapshot.params['id'];
    if (!paymentId) {
      this.error = 'No payment ID provided';
      this.loading = false;
      return;
    }

    try {
      const { data }: any = await this.http.get(`/order/payment/${paymentId}`);
      this.payment = data.data || data;
    } catch (err) {
      console.error('Failed to fetch payment details:', err);
      this.error = 'Failed to load payment details';
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }
}
