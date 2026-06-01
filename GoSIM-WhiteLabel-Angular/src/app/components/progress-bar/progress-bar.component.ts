import { Component, Input, computed, signal } from '@angular/core';
import { NgClass, NgStyle } from '@angular/common';

@Component({
  selector: 'app-progress-bar',
  standalone: true,
  imports: [NgClass, NgStyle],
  template: `
    <div class="w-full bg-gray-200 rounded-full h-3">
      <div
        [ngClass]="[
          'h-3 rounded-full',
          progressPercent < 33 ? 'bg-red-500' : progressPercent < 66 ? 'bg-yellow-400' : 'bg-green-500'
        ]"
        [ngStyle]="{ width: progressPercent + '%' }"
      ></div>
    </div>
  `
})
export class ProgressBarComponent {
  @Input() progress: number = 0;
  @Input() maximum: number = 100;

  get progressPercent(): number {
    const val = (this.progress * 100) / this.maximum;
    return val === 0 ? 1 : val;
  }
}
