import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { NgIf, NgClass } from '@angular/common';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { I18nService } from '../../services/i18n.service';

@Component({
  selector: 'app-device-compatibility-modal',
  standalone: true,
  imports: [NgIf, NgClass, TranslatePipe],
  styles: [`
    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: .9; transform: scale(1.03); }
    }
    .animate-pulse-custom {
      animation: pulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }
  `],
  template: `
    <!-- Device Compatibility Check Modal -->
    <div *ngIf="isVisible" class="fixed inset-0 z-50 flex items-end justify-center">
      <div class="absolute inset-0 bg-black/50" (click)="closeModal()"></div>
      <div class="relative bg-white rounded-t-3xl w-full max-w-md mx-auto" style="min-height: 70vh;">
        <div class="flex flex-col gap-4 py-6 px-6 max-w-md mx-auto">
          <div class="flex items-start justify-between">
            <h3 class="text-xl font-extrabold text-gray-900">{{ 'orders.deviceCompatibilityTitle' | t }}</h3>
            <button (click)="closeModal()"
              [ngClass]="i18n.locale === 'ar' ? 'absolute md:static top-4 left-4' : 'absolute md:static top-4 right-4'">
              <i class="fa-solid fa-circle-xmark text-gray-400 hover:text-gray-600 transition-colors text-3xl"></i>
            </button>
          </div>

          <div class="flex flex-col items-center gap-6 mt-2">
            <!-- Device Check Representation -->
            <div class="flex items-center justify-center w-24 h-24 rounded-full bg-red-50 border border-red-100 text-red-500 animate-pulse-custom">
              <i class="fa-solid fa-mobile-screen text-4xl"></i>
            </div>

            <!-- Description -->
            <div class="flex flex-col gap-2 text-center">
              <p class="text-sm text-gray-600 leading-relaxed">{{ 'orders.compatibilityModalDescription' | t }}</p>
            </div>

            <!-- Instructions -->
            <div class="bg-gray-50 rounded-2xl p-4 w-full border border-gray-100">
              <div class="flex flex-col gap-3">
                <div class="flex items-center gap-3">
                  <span class="w-6 h-6 rounded-full bg-red-100 text-[#DB143C] text-xs font-bold flex items-center justify-center flex-shrink-0">1</span>
                  <p class="text-xs text-gray-700 font-medium leading-relaxed">{{ 'orders.compatibilityStep1' | t }}</p>
                </div>
              </div>
            </div>

            <!-- Check Button -->
            <button
              (click)="checkDeviceCompatibility()"
              class="bg-[#DB143C] w-full hover:bg-red-700 text-white px-6 py-4 rounded-xl font-semibold text-sm transition-colors shadow-md hover:shadow-lg active:scale-[0.98] transform duration-150">
              {{ 'orders.checkCompatibilityButton' | t }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DeviceCompatibilityModalComponent implements OnChanges {
  @Input() modelValue: boolean = false;
  @Input() autoCheckOnClose: boolean = false;
  @Output() modelValueChange = new EventEmitter<boolean>();
  @Output() compatibilityChecked = new EventEmitter<void>();
  @Output() modalClosed = new EventEmitter<void>();

  isVisible: boolean = false;

  constructor(public i18n: I18nService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['modelValue']) {
      this.isVisible = changes['modelValue'].currentValue;
    }
  }

  closeModal() {
    this.isVisible = false;
    this.modelValueChange.emit(false);
    this.handleModalClose();
  }

  handleModalClose() {
    this.modalClosed.emit();
    if (this.autoCheckOnClose) {
      this.compatibilityChecked.emit();
    }
  }

  checkDeviceCompatibility() {
    try {
      const dialLink = 'tel:*%2306%23';
      if (/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        window.location.href = dialLink;
      }

      setTimeout(() => {
        this.closeModal();
        this.compatibilityChecked.emit();
      }, 1000);
    } catch (error) {
      console.error('Error opening dialer:', error);
      setTimeout(() => {
        this.closeModal();
        this.compatibilityChecked.emit();
      }, 2000);
    }
  }
}
