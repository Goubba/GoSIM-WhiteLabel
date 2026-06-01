import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { NgIf, NgFor, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { HttpService } from '../../services/http.service';
import { UtilsService } from '../../services/utils.service';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [NgIf, NgFor, NgClass, FormsModule, RouterLink, TranslatePipe],
  template: `
    <!-- Search Bar -->
    <div class="relative w-full border border-gray-100 rounded-2xl">
      <input type="search" [(ngModel)]="search"
        class="border-none rounded-2xl pl-10 py-3 w-full bg-gray-50 placeholder:text-sm placeholder:text-gray-500"
        [placeholder]="'home.searchCountry' | t" (ngModelChange)="onSearchChange()" />
      <div class="absolute left-0 inset-y-0 rounded-l-lg flex items-center justify-center px-4">
        <i class="fa-solid fa-magnifying-glass text-gray-400"></i>
      </div>
    </div>

    <!-- Tabs Selector -->
    <div class="flex my-4 rounded-2xl bg-gray-100">
      <button (click)="activeTab = 'countries'" class="w-full py-2 rounded-2xl font-bold text-center cursor-pointer"
        [ngClass]="activeTab === 'countries' ? 'bg-primary text-white' : ''">
        {{ 'home.countries' | t }}
      </button>
      <button (click)="activeTab = 'regions'" class="w-full py-2 rounded-2xl font-bold text-center cursor-pointer"
        [ngClass]="activeTab === 'regions' ? 'bg-primary text-white' : ''">
        {{ 'home.regions' | t }}
      </button>
    </div>

    <div>
      <!-- Countries Loading Skeleton -->
      <div *ngIf="loading" class="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-4">
        <div *ngFor="let i of [1,2,3,4,5,6,7,8]" class="rounded-2xl bg-gray-100 animate-pulse">
          <div class="w-full h-42">
            <div class="h-full w-full rounded-t-2xl bg-gray-200 border border-gray-300"></div>
          </div>
          <div class="flex gap-2 items-center justify-start p-3">
            <div class="h-12 w-12 rounded-full bg-gray-300 border border-gray-300 shrink-0"></div>
            <div class="flex flex-col gap-2 w-full">
              <div class="h-4 bg-gray-300 rounded w-3/4"></div>
              <div class="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Content Display when not loading -->
      <div *ngIf="!loading">
        <!-- Countries Tab Content -->
        <div>
          <!-- No Results State -->
          <div *ngIf="activeLocations.length === 0" class="text-center pt-16 pb-8 flex flex-col items-center">
            <div class="flex items-center justify-center bg-gray-100 rounded-xl w-32 h-32 relative">
              <i class="fa-light fa-map-location-dot text-gray-400 text-4xl"></i>
              <i class="fa-light fa-slash text-gray-400 text-4xl absolute"></i>
            </div>
            <div class="mt-8">
              <h3>{{ 'home.noResult' | t }}</h3>
              <p class="text-gray-600 mt-2 max-w-80">{{ 'home.noResultText' | t }}</p>
            </div>
            <button (click)="search = ''; getLocations()" class="btn-primary w-full mt-8">
              {{ 'home.noResultButton' | t }}
            </button>
          </div>

          <!-- List -->
          <div *ngIf="activeLocations.length > 0" class="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-4">
            <a *ngFor="let location of activeLocations"
              [routerLink]="['/packages', location.code]">
              <div class="rounded-2xl bg-gray-100 hover:bg-gray-100 transition-colors">
                <div class="w-full h-42">
                  <img [src]="location.cover" class="h-full w-full rounded-t-2xl object-cover border border-gray-400" />
                </div>
                <div class="flex gap-2 items-center justify-start font-medium text-sm p-3 text-gray-700">
                  <img [src]="location.image" class="size-10 sm:size-12 rounded-full object-cover border border-gray-400" />
                  <div>
                    <p class="line-clamp-1">{{ location.name }}</p>
                    <span class="text-xs sm:text-sm line-clamp-1" *ngIf="location.fromPrice">
                      {{ 'home.startingAt' | t }} {{ utils.currencyFormatter(location.fromPrice) }}
                    </span>
                  </div>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  `
})
export class SearchViewComponent implements OnInit, OnDestroy {
  activeTab: 'countries' | 'regions' = 'countries';
  loading = false;
  search = '';
  countries: any[] = [];
  regions: any[] = [];
  glob: any[] = [];

  private debounceTimer: any;

  constructor(
    private http: HttpService,
    public utils: UtilsService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.getLocations();
  }

  ngOnDestroy() {
    if (this.debounceTimer) clearTimeout(this.debounceTimer);
  }

  get combinedRegions(): any[] {
    return [...this.glob, ...this.regions];
  }

  get activeLocations(): any[] {
    return this.activeTab === 'countries' ? this.countries : this.combinedRegions;
  }

  onSearchChange() {
    if (this.debounceTimer) clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      this.getLocations();
    }, 300);
  }

  getLocations() {
    this.loading = true;
    this.cdr.detectChanges();
    const url = `/locations${this.search ? `?search=${encodeURIComponent(this.search)}` : ''}`;
    this.http.get(url)
      .then(({ data }: any) => {
        this.loading = false;
        this.countries = data.data.countries || [];
        this.regions = data.data.regions || [];
        this.glob = data.data.glob || [];
        this.cdr.detectChanges();
      })
      .catch(() => {
        this.loading = false;
        this.cdr.detectChanges();
      });
  }
}
