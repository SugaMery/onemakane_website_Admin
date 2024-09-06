// page.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PageService {
  private apiUrl = 'https://api.onemakan.com/v1/pages';
  //getPageBySlug: any;

  constructor(private http: HttpClient) {}

  getPage(pageId: string, langId: string): Observable<any> {
    const url = `${this.apiUrl}/${pageId}/${langId}`;
    return this.http.get(url);
  }
  getPageBySlug(slug: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/pages?slug=${slug}`);
  }

  updatePage(pageLangId: string, body: any ,accessToken: string): Observable<any> {
    const url = `https://api.onemakan.com/v1/page-langs/${pageLangId}`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`, // Ajouter l'en-tête d'autorisation avec le token
    });
    return this.http.patch(url, body,{ headers });
  }
}
