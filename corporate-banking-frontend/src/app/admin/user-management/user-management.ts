import { AdminService } from './../adminservice';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIcon } from "@angular/material/icon";


@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatTableModule, MatSlideToggleModule, MatIcon],
  templateUrl: './user-management.html',
  styleUrls: ['./user-management.css']
})
export class UserManagementComponent implements OnInit {

  users: any[] = [];
  displayedColumns: string[] = [
    'username',
    'email',
    'role',
    'active'
  ];
  hidePassword = true;


  newUser = {
    username: '',
    email: '',
    password: '',
    role: ''
  };

  columns = ['username', 'role', 'status', 'action'];


  constructor(private AdminService: AdminService) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.AdminService.getAllUsers().subscribe(data => {
      this.users = data;
    });
  }

  createUser() {
    this.AdminService.createUser(this.newUser).subscribe(() => {
      alert('User created');
      this.newUser = { username: '', email: '', password: '', role: '' };
      this.loadUsers();
    });
  }

  toggleStatus(user: any) {
  this.AdminService
    .updateUserStatus(user.id, !user.active)
    .subscribe({
      next: () => {
        user.active = !user.active; // UI update
      },
      error: () => {
        alert('Failed to update status');
      }
    });
}
}
