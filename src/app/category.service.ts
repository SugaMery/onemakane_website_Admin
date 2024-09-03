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

  private apiUrls = 'https://api.onemakan.com/v1';

  private getHeaders(accessToken: string): HttpHeaders {
    return this.headers.set('Authorization', `Bearer ${accessToken}`);
  }

  createCategory(categoryData: any, accessToken: string): Observable<any> {
    const url = `${this.apiUrls}/categories`;
    return this.http.post<any>(url, categoryData, {
      headers: this.getHeaders(accessToken),
    });
  }

  uploadFile(file: File, accessToken: string): Promise<any> {
    const formData = new FormData();
    formData.append('media_file', file);

    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
    });

    return this.http
      .post<any>('https://api.onemakan.com/v1/medias', formData, { headers })
      .toPromise();
  }

  getCategoriesFrom(accessToken: string): Observable<any> {
    const url = `${this.apiUrls}/categories`;
    return this.http.get<any[]>(url, { headers: this.getHeaders(accessToken) });
  }

  getCategoryById(categoryId: string, accessToken: string): Observable<any> {
    const url = `${this.apiUrls}/categories/${categoryId}`;
    return this.http.get(url, { headers: this.getHeaders(accessToken) });
  }

  updateCategoryById(
    categoryId: string,
    categoryData: any,
    accessToken: string
  ): Observable<any> {
    const url = `${this.apiUrls}/categories/${categoryId}`;
    return this.http.patch(url, categoryData, {
      headers: this.getHeaders(accessToken),
    });
  }


  getCategoryByTreeList(): Observable<any> {
    const url = `${this.apiUrls}/categories/tree-list`;
    return this.http.get(url);
  }
}
