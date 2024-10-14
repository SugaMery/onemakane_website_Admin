import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private baseUrl = 'https://devapi.onemakan.com/mp1'; // Base URL for the API

  constructor(private http: HttpClient) {}

  // Method to get all products
  getProducts(accessToken: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
    });

    return this.http.get(`${this.baseUrl}/products`, { headers });
  }

  // Method to get a specific product by ID
  getProductById(productId: number, accessToken: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
    });

    return this.http.get(`${this.baseUrl}/products/${productId}`, { headers });
  }

  // Method to update a specific product
  updateProduct(productId: number, productData: any, accessToken: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
    });

    return this.http.put(`${this.baseUrl}/products/${productId}`, productData, { headers });
  }

  // Method to delete a specific product
  deleteProduct(productId: number, accessToken: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
    });

    return this.http.delete(`${this.baseUrl}/products/${productId}`, { headers });
  }

  // Method to create a new product
  createProduct(productData: any, accessToken: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
    });

    return this.http.post(`${this.baseUrl}/products`, productData, { headers });
  }
}
