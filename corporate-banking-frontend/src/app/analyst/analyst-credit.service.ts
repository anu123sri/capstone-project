import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AnalystCreditService {

  //private baseUrl = 'http://localhost:9090/api/credit-requests';
  private baseUrl = `${environment.apiUrl}/credit-requests`;


  constructor(private http: HttpClient) {}

  // Analyst → View ALL credit requests
  getAllCredits(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  // Analyst → Approve / Reject
  decideCredit(
    requestId: string,
    status: 'APPROVED' | 'REJECTED',
    remarks: string
  ) {
    return this.http.put(
      `${this.baseUrl}/${requestId}`,
      { status, remarks }
    );
  }
}
