import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet} from '@angular/router';
import { CommonModule } from '@angular/common';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../auth/authservice';



@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './app-layout.html',
  styleUrls: ['./app-layout.css']
})
export class AppLayoutComponent implements OnInit {

  role: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.role = this.authService.getRole();
  }

  logout() {
  this.authService.logout();
  this.router.navigate(['/login']);
}

}
