import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private apiUrl = 'http://localhost:3000/categories';
  private headers = new HttpHeaders();

  constructor(private http: HttpClient) {
    this.headers = this.headers.set('Content-Type', 'application/json');
  }
  getAllCategories(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  addCategory(category: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, category);
  }

  updateCategory(categoryId: string, formData: FormData): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${categoryId}`, formData);
  }

  deleteCategory(categoryId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${categoryId}`);
  }

  private apiUrls = 'https://devapi.onemakan.com/v1';

  private getHeaders(accessToken: string): HttpHeaders {
    return this.headers.set('Authorization', `Bearer ${accessToken}`);
  }

  createCategory(categoryData: any, accessToken: string): Observable<any> {
    const url = `${this.apiUrls}/categories`;
    return this.http.post<any>(url, categoryData, {
      headers: this.getHeaders(accessToken),
    });
  }

  uploadImages(mediaData: any, accessToken: string): Observable<any> {
    const url = `${this.apiUrl}/medias`;
    return this.http.post<any>(url, mediaData, {
      headers: this.getHeaders(accessToken),
    });
  }

  getCategoriesFrom(accessToken: string): Observable<any> {
    const url = `${this.apiUrls}/categories`;
    return this.http.get<any[]>(url, { headers: this.getHeaders(accessToken) });
  }
}
