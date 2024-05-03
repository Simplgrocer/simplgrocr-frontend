import { Component } from '@angular/core';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-progress-spinner-lg',
  standalone: true,
  imports: [ProgressSpinnerModule],
  templateUrl: './progress-spinner-lg.component.html',
  styleUrl: './progress-spinner-lg.component.css',
})
export class ProgressSpinnerLgComponent {}
