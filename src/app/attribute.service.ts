import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AttributeService {
  private baseUrl = 'https://devapi.onemakan.com/mp1'; // Update this URL if needed

  constructor(private http: HttpClient) {}

  // Fetch all attributes
  getAttributes(accessToken: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
    });

    return this.http.get(`${this.baseUrl}/attributes`, { headers });
  }

  // Fetch attribute by ID
  getAttributeById(attributeId: string, accessToken: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
    });

    return this.http.get(`${this.baseUrl}/attributes/${attributeId}`, { headers });
  }
  
  // You can add methods for updating and saving attributes here if needed
}
