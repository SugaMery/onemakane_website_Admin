import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FeatureService {
  private baseUrl = 'https://restapi.onemakan.com/mp1'; // Update this if needed

  constructor(private http: HttpClient) {}

  // Method to get all taxes
  getFeatures(accessToken: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
    });

    return this.http.get(`${this.baseUrl}/features`, { headers });
  }

  // Method to get a specific tax by ID
  getFeatureById(featureId: number, accessToken: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
    });

    return this.http.get(`${this.baseUrl}/features/${featureId}`, { headers });
  }

  // Method to update a specific tax
  updateFeature(featureId: number, taxData: any, accessToken: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
    });

    return this.http.put(`${this.baseUrl}/features/${featureId}`, taxData, { headers });
  }

  // Method to delete a specific tax
  deleteFeature(featureId: number, accessToken: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
    });

    return this.http.delete(`${this.baseUrl}/features/${featureId}`, { headers });
  }

  // Method to create a new tax
  createFeature(featureData: any, accessToken: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
    });

    return this.http.post(`${this.baseUrl}/features`, featureData, { headers });
  }
}
