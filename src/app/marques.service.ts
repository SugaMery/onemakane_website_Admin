import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MarquesService {

  private baseUrl = 'https://devapi.onemakan.com/mp1'; // Base URL for the API

  constructor(private http: HttpClient) {}

  // Method to get all brands (similar to fetching all features)
  getBrands(accessToken: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
    });

    return this.http.get(`${this.baseUrl}/brands`, { headers });
  }

  
  // Method to get a specific brand by ID
  getBrandById(brandId: number, accessToken: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
    });

    return this.http.get(`${this.baseUrl}/brands/${brandId}`, { headers });
  }

  // Method to update a specific brand
  updateBrand(brandId: number, brandData: any, accessToken: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
    });

    return this.http.put(`${this.baseUrl}/brands/${brandId}`, brandData, { headers });
  }

  // Method to delete a specific brand
  deleteBrand(brandId: number, accessToken: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
    });

    return this.http.delete(`${this.baseUrl}/brands/${brandId}`, { headers });
  }

  // Method to create a new brand
  createBrand(brandData: any, accessToken: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
    });

    return this.http.post(`${this.baseUrl}/brands`, brandData, { headers });
  }
}
