import { Component } from '@angular/core';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-progress-spinner-sm',
  standalone: true,
  imports: [ProgressSpinnerModule],
  templateUrl: './progress-spinner-sm.component.html',
  styleUrl: './progress-spinner-sm.component.css',
})
export class ProgressSpinnerSmComponent {}
