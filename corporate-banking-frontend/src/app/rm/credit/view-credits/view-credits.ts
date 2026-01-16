import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';

import { RmCreditService } from '../rm-credit.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-view-credits',
  standalone: true,
  templateUrl: './view-credits.html',
  styleUrls: ['./view-credits.css'],
  imports: [
    CommonModule,
    MatCardModule
  ]
})
export class ViewCreditsComponent implements OnInit {

  credits: any[] = [];
  loading = true;
  error = '';

  constructor(private creditService: RmCreditService, private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    console.log('📌 ViewCreditsComponent INIT');

    this.creditService.getMyCreditRequests().subscribe({
  next: (data) => {
    this.credits = data;
    this.loading = false;

    this.cd.detectChanges(); // 🔥 FORCE UI UPDATE
  },
  error: (err) => {
    this.error = 'Failed to load credit requests';
    this.loading = false;

    this.cd.detectChanges(); // 🔥 IMPORTANT
  }
});

  }
}

