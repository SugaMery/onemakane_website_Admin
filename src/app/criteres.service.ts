import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CriteresService {
  private apiUrl = 'https://restapi.onemakan.com/v1/settings';

  constructor(private http: HttpClient) {}

  getSettings(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  createCritere(critere: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, critere);
  }

  updateCritere(critere: any,accessToken : any, seetingLangID:any): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
    });
    return this.http.put<any>(`${this.apiUrl}/${critere.id}/setting-langs/${seetingLangID}`,{ headers }, critere);
  }

  deleteCritere(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
