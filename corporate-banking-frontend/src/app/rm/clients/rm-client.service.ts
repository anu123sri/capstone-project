import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class RmClientService {

  private rmBaseUrl = `${environment.apiUrl}/rm/clients`;

  constructor(private http: HttpClient) {}

  createClient(payload: any): Observable<any> {
    return this.http.post(this.rmBaseUrl, payload);
  }

  getClients(): Observable<any[]> {
    return this.http.get<any[]>(this.rmBaseUrl);
  }

  searchClients(name?: string, industry?: string): Observable<any[]> {
    const params: any = {};
    if (name) params.name = name;
    if (industry) params.industry = industry;

    return this.http.get<any[]>(this.rmBaseUrl, { params });
  }

  getClientById(id: string): Observable<any> {
    return this.http.get<any>(`${this.rmBaseUrl}/${id}`);
  }

  updateClient(id: string, payload: any): Observable<any> {
    return this.http.put(`${this.rmBaseUrl}/${id}`, payload);
  }
}
