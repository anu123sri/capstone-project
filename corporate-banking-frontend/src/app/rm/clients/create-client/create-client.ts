import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';

import { RmClientService } from '../rm-client.service';

@Component({
  selector: 'app-create-client',
  standalone: true,
  templateUrl: './create-client.html',
  styleUrls: ['./create-client.css'],
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule
  ]
})
export class CreateClientComponent {

  // ✅ FLAT DTO MODEL (matches ClientRequest)
  client = {
    companyName: '',
    industry: '',
    address: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    annualTurnover: null as number | null,
    documentsSubmitted: false
  };

  constructor(private clientService: RmClientService) {}

  createClient() {
    // ✅ Payload EXACTLY as backend expects
    const payload = {
      companyName: this.client.companyName,
      industry: this.client.industry,
      address: this.client.address,
      contactName: this.client.contactName,
      contactEmail: this.client.contactEmail,
      contactPhone: this.client.contactPhone,
      annualTurnover: this.client.annualTurnover,
      documentsSubmitted: this.client.documentsSubmitted
    };

    this.clientService.createClient(payload).subscribe({
      next: () => {
        alert('✅ Client created successfully');
        this.resetForm();
      },
      error: (err) => {
        console.error(err);
        alert(err.error?.message || '❌ Failed to create client');
      }
    });
  }

  resetForm() {
    this.client = {
      companyName: '',
      industry: '',
      address: '',
      contactName: '',
      contactEmail: '',
      contactPhone: '',
      annualTurnover: null,
      documentsSubmitted: false
    };
  }
}
