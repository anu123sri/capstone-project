import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RmCreditService {

  //private baseUrl = 'http://localhost:9090/api/credit-requests';
  private baseUrl = `${environment.apiUrl}/credit-requests`;


  constructor(private http: HttpClient) {}

  // ✅ RM → Create Credit Request
  createCreditRequest(payload: any): Observable<any> {
    return this.http.post(this.baseUrl, payload);
  }

  // ✅ RM → View My Credit Requests
  getMyCreditRequests(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }
}
