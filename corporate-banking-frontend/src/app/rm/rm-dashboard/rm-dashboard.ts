import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-rm-dashboard',
  standalone: true,
  templateUrl: './rm-dashboard.html',
  styleUrls: ['./rm-dashboard.css'],
  imports: [
    CommonModule,
    RouterModule,      
    MatCardModule,
    MatButtonModule
  ]
})
export class RmDashboard {}
