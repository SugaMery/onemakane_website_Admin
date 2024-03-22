import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = 'http://localhost:3000/categories';

  constructor(private http: HttpClient) { }

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
}
