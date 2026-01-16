import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { RmClientService } from '../clients/rm-client.service';



@Component({
  selector: 'app-edit-client',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-client.html',
  styleUrls: ['./edit-client.css']
})
export class EditClientComponent implements OnInit {

  clientForm!: FormGroup;
  clientId!: string;
  isSubmitted = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private clientService: RmClientService
  ) {}

  ngOnInit(): void {
    this.clientId = this.route.snapshot.paramMap.get('id')!;

    this.clientForm = this.fb.group({
      companyName: ['', Validators.required],
      industry: ['', Validators.required],
      address: [''],
      contactName: ['', Validators.required],
      contactEmail: ['', [Validators.required, Validators.email]],
      contactPhone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      annualTurnover: ['', [Validators.required, Validators.min(1)]]
    });

    this.loadClient();
  }

  loadClient() {
    this.clientService.getClientById(this.clientId).subscribe({
      next: (client: any) => {
        this.isSubmitted = client.documentsSubmitted;

        this.clientForm.patchValue({
          companyName: client.companyName,
          industry: client.industry,
          address: client.address,
          contactName: client.primaryContact?.name,
          contactEmail: client.primaryContact?.email,
          contactPhone: client.primaryContact?.phone,
          annualTurnover: client.annualTurnover
        });

        if (this.isSubmitted) {
          this.clientForm.disable();
        }
      }
    });
  }

  updateClient() {
    if (this.isSubmitted) {
      alert('Submitted clients cannot be edited');
      return;
    }

    if (this.clientForm.invalid) {
      this.clientForm.markAllAsTouched();
      return;
    }

    this.clientService.updateClient(this.clientId, this.clientForm.value).subscribe({
      next: () => {
        alert('Client updated successfully');
        this.router.navigate(['/rm/clients']);
      },
      error: (err: HttpErrorResponse) => {
        alert(err.error?.message || 'Update failed');
      }
    });
  }
}
