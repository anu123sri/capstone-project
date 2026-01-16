import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AnalystCreditService } from '../analyst-credit.service';
import { ChangeDetectorRef } from '@angular/core';


@Component({
  selector: 'app-credit-requests',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './credit-requests.html',
  styleUrls: ['./credit-requests.css']
})
export class CreditRequestsComponent implements OnInit {

  credits: any[] = [];
  loading = true;
  error = '';

  // Modal state
  showModal = false;
  selectedCreditId = '';
  selectedAction: 'APPROVED' | 'REJECTED' | null = null;
  remarks = '';
  decisionLoading = false;

  constructor(private creditService: AnalystCreditService,private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadCredits();
  }

  loadCredits() {
    this.loading = true;

    this.creditService.getAllCredits().subscribe({
      next: data => {
        console.log('API DATA 👉', data);
        this.credits = data;
        this.loading = false;
        this.cd.detectChanges(); 
      },
      error: () => {
        this.error = 'Failed to load credit requests';
        this.loading = false;
      }
    });
  }

  openModal(id: string, action: 'APPROVED' | 'REJECTED') {
    this.selectedCreditId = id;
    this.selectedAction = action;
    this.remarks = '';
    this.showModal = true;
  }

  submitDecision() {
    if (!this.selectedAction) return;

    if (!this.remarks.trim()) {
      alert('Remarks are required');
      return;
    }

    this.decisionLoading = true;

    this.creditService
      .decideCredit(this.selectedCreditId, this.selectedAction, this.remarks)
      .subscribe({
        next: () => {
          this.decisionLoading = false;
          this.closeModal();
          this.loadCredits(); // refresh list
        },
        error: () => {
          this.decisionLoading = false;
          alert('Failed to update decision');
        }
      });
  }

  closeModal() {
    this.showModal = false;
    this.selectedCreditId = '';
    this.selectedAction = null;
    this.remarks = '';
  }
}
