import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BackgroundImageService {

  private baseUrl = 'http://localhost:3000'; // Update with your Node.js server URL

  constructor(private http: HttpClient) { }

  uploadBackgroundImage(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/background_images`, formData);
  }
}
