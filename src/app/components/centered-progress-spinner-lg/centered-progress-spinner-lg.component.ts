import { Component } from '@angular/core';
import { ProgressSpinnerLgComponent } from '../progress-spinner-lg/progress-spinner-lg.component';

@Component({
  selector: 'app-centered-progress-spinner-lg',
  standalone: true,
  imports: [ProgressSpinnerLgComponent],
  templateUrl: './centered-progress-spinner-lg.component.html',
  styleUrl: './centered-progress-spinner-lg.component.css',
})
export class CenteredProgressSpinnerLgComponent {}
