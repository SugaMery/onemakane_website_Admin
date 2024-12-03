import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, switchMap, of } from 'rxjs';
import { Article } from './article.module';

@Injectable({
  providedIn: 'root'
})
export class BlogsService {

  private apiUrl = 'http://localhost:3000/articles'; // Your backend URL
  private apiUrls = 'http://localhost:3000/articles-lists'; // Your backend URL

  constructor(private http: HttpClient) {}

  // Get all articles from the server
  getArticles(): Observable<Article[]> {
    return this.http.get<Article[]>(this.apiUrl); // Fetch from backend
  }


  addArticle(article: any): Observable<any> {
    return this.http.post(this.apiUrl, article);
  }


  // Get a specific article by ID
  getArticleById(id: number): Observable<Article> {
    return this.http
      .get<Article[]>(this.apiUrl)
      .pipe(map((articles) => articles.find((a) => a.id === id)!));
  }

  // Add a comment to an article (send updated article to backend)
  addComment(
    articleId: number,
    comment: string,
    userName: string,
    email: string
  ): Observable<void> {
    return this.getArticleById(articleId).pipe(
      switchMap((article) => {
        if (article) {
          const newComment = {
            user: userName,
            comment: comment,
            email: email,
            date: new Date().toLocaleString(),
          };
          article.comments.push(newComment); // Add new comment

          // Send updated article back to the server
          return this.http.put<void>(`${this.apiUrl}/${articleId}`, article);
        }
        return of(undefined); // If no article found, return an empty observable
      })
    );
  }


    // Update an article by ID
    updateArticle(id: number, updatedArticle: Article): Observable<Article> {
      return this.http.put<Article>(`${this.apiUrls}/${id}`, updatedArticle);
    }
  
        // Update an article by ID
        updateArticles(id: number, updatedArticle: any): Observable<Article> {
          return this.http.put<Article>(`${this.apiUrls}/${id}`, updatedArticle);
        }
    // Delete an article by ID
    deleteArticle(id: number): Observable<void> {
      return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
