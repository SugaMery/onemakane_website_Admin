import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, map, Observable, of, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl = 'https://api.onemakan.com/v1';

  constructor(private http: HttpClient) {}

  login(userDetails: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/login`, userDetails);
  }

  getUserInfoById(userId: number, accessToken: string,deleted?: number): Observable<any> {

    let url = `${this.baseUrl}/users/${userId}`;
    
    if (deleted) {
      url += `?deleted=${encodeURIComponent(deleted)}`;
    }
    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
    });
    return this.http.get<any>(url , { headers });

  }
  // Méthode pour obtenir les annonces d'un utilisateur
  getUserAdsById(userId: number, accessToken: string,deleted?: number, page: number = 1): Observable<any> {
    let url = `${this.baseUrl}/users/${userId}/ads?page=${page}`; // Endpoint pour les annonces d'un utilisateur
    if (deleted) {
      url += `?deleted=${encodeURIComponent(deleted)}`;
    }
    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`, // Ajouter l'en-tête d'autorisation avec le token
    });

    return this.http.get<any>(url, { headers });
  }



  getUserAllAdsById(userId: number, accessToken: string,deleted?: number): Observable<any[]> {
    return this.getUserAdsById(userId,accessToken,deleted).pipe(
      switchMap((response) => {
        const totalPages = response.pagination.total_page;
        const requests: Observable<any>[] = [];

        // Push the first page response
        requests.push(of(response));

        // Create requests for all other pages
        for (let page = 2; page <= totalPages; page++) {
          requests.push(this.getUserAdsById(userId,accessToken,deleted, page));
        }

        // Execute all requests and combine results
        return forkJoin(requests).pipe(
          map((responses) => responses.flatMap((res) => res.data))
        );
      })
    );
  }







  deleteUser(userId: number, accessToken: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
    });

    return this.http.delete(`${this.baseUrl}/users/${userId}`, { headers });
  }
  getUsers(deleted: number, accessToken: string, roleId?: number): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
    });
  
    let params = new HttpParams().set('deleted', deleted.toString());
  
    if (roleId !== undefined) {
      params = params.set('role_id', roleId.toString());
    }
  
    return this.http.get(`${this.baseUrl}/users`, { headers, params });
  }
  


  updateUser(
    userId: string,
    accessToken: string,
    userData: any
  ): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
    });

    return this.http.patch<any>(`${this.baseUrl}/users/${userId}`, userData, {
      headers,
    });
  }

}
