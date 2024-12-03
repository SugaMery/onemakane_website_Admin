import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {

  private baseUrl = 'https://restapi.onemakan.com/v1';

  constructor(private http: HttpClient) {}

  getContacts(accessToken:string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
    });
    return this.http.get(`${this.baseUrl}/contacts`,{ headers });
  }

    // Fetch details of the selected contact
    getContactsById(contactId: string,accessToken:string): Observable<any> {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${accessToken}`,
      });
      return this.http.get(`${this.baseUrl}/contacts/${contactId}`,{ headers });
    }
  
}
