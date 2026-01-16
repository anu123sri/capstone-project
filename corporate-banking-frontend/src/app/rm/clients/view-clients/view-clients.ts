import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import { RmClientService } from '../rm-client.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-view-clients',
  standalone: true,
  templateUrl: './view-clients.html',
  styleUrls: ['./view-clients.css'],
  imports: [
    CommonModule,   // needed for *ngIf, *ngFor, async pipe
    MatCardModule,
    FormsModule
  ]
})
export class ViewClientsComponent implements OnInit {
  userRole: string = '';
  companyName: string = '';
  industry: string = '';

  clients$!: Observable<any[]>;

  constructor(private clientService: RmClientService,private router: Router) {}

  ngOnInit(): void {
    this.clients$ = this.clientService.getClients();

    const role = localStorage.getItem('role') || '';
    this.userRole = role.replace('ROLE_', '');
    console.log('ROLE FROM STORAGE:', localStorage.getItem('role'));
console.log('USER ROLE:', this.userRole);

  }

  searchClients() {
    this.clients$ = this.clientService.searchClients(
      this.companyName,
      this.industry
    );
  }

  editClient(client: any) {
  this.router.navigate(['/rm/clients', client.id, 'edit']);
}
}

