import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  private baseUrl = 'https://restapi.onemakan.com/v1';

  constructor(private http: HttpClient) {}

  getOrders(accessToken:string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
    });
    return this.http.get(`${this.baseUrl}/orders`,{ headers });
  }

    // Fetch details of the selected contact
    getOrdersById(ordersId: string,accessToken:string): Observable<any> {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${accessToken}`,
      });
      return this.http.get(`${this.baseUrl}/orders/${ordersId}`,{ headers });
    }
}
