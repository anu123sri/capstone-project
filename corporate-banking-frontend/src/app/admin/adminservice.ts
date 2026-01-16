import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  //private baseUrl = 'http://localhost:9090/api/admin';

  private baseUrl = `${environment.apiUrl}/admin`;


  constructor(private http: HttpClient) {}

  getAllUsers() {
    return this.http.get<any[]>(`${this.baseUrl}/users`);
  }

  createUser(user: any) {
    return this.http.post(`${this.baseUrl}/users`, user);
  }

  updateUserStatus(userId: string, active: boolean) {
  return this.http.put(
  `${this.baseUrl}/users/${userId}/status?active=${active}`,
  {}
);
}
}
