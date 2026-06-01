import { Component, Input } from '@angular/core';
import { NgIf, NgClass } from '@angular/common';
import { Router } from '@angular/router';
import { I18nService } from '../../services/i18n.service';

@Component({
  selector: 'app-desktop-page-header',
  standalone: true,
  imports: [NgIf, NgClass],
  template: `
    <div class="hidden md:block my-8">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <button *ngIf="showArrow" (click)="goBack()" class="text-gray-600 hover:text-gray-900 transition-colors">
            <i class="fa-solid fa-angle-left text-2xl"
               [ngClass]="i18n.locale === 'ar' ? 'rotate-180' : ''"></i>
          </button>
          <h1 class="text-3xl font-bold text-gray-900">{{ title }}</h1>
        </div>
        <ng-content select="[actions]"></ng-content>
      </div>
    </div>
  `
})
export class DesktopPageHeaderComponent {
  @Input() title: string = '';
  @Input() showArrow: boolean = true;
  @Input() backRoute: string | null = null;
  @Input() customBackAction: (() => void) | null = null;

  constructor(public i18n: I18nService, private router: Router) {}

  goBack() {
    if (this.customBackAction) {
      this.customBackAction();
    } else if (this.backRoute) {
      this.router.navigate([this.backRoute]);
    } else {
      window.history.back();
    }
  }
}
