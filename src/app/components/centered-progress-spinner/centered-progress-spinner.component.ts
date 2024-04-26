import { Component } from '@angular/core';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-centered-progress-spinner',
  standalone: true,
  imports: [ProgressSpinnerModule],
  templateUrl: './centered-progress-spinner.component.html',
  styleUrl: './centered-progress-spinner.component.css'
})
export class CenteredProgressSpinnerComponent {

}
