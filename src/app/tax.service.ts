import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaxService {
  private baseUrl = 'https://devapi.onemakan.com/mp1'; // Update this if needed

  constructor(private http: HttpClient) {}

  // Method to get all taxes
  getTaxes(accessToken: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
    });

    return this.http.get(`${this.baseUrl}/taxes`, { headers });
  }

  // Method to get a specific tax by ID
  getTaxById(taxId: number, accessToken: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
    });

    return this.http.get(`${this.baseUrl}/taxes/${taxId}`, { headers });
  }

  // Method to update a specific tax
  updateTax(taxId: number, taxData: any, accessToken: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
    });

    return this.http.put(`${this.baseUrl}/taxes/${taxId}`, taxData, { headers });
  }

  // Method to delete a specific tax
  deleteTax(taxId: number, accessToken: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
    });

    return this.http.delete(`${this.baseUrl}/taxes/${taxId}`, { headers });
  }

  // Method to create a new tax
  createTax(taxData: any, accessToken: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
    });

    return this.http.post(`${this.baseUrl}/taxes`, taxData, { headers });
  }
}
