import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  isAuthenticated!: boolean;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.isAuthenticated = this.authService.isAuthenticated();
  }
}
