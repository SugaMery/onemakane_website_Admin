import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BlogsService } from '../blogs.service';
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-edit-blogs',
  templateUrl: './edit-blogs.component.html',
  styleUrl: './edit-blogs.component.css'
})
export class EditBlogsComponent {
  article: any;

  constructor(    private http: HttpClient,
    private router: Router,private route: ActivatedRoute, private articleService: BlogsService,private toastService: MessageService) { }

  ngOnInit(): void {
    const articleId = this.route.snapshot.paramMap.get('id'); // Get the article ID from URL
    if (articleId) {
      this.articleService.getArticleById(Number(articleId)).subscribe((data: any) => {
        this.article = data; // Assuming the response is the full article
      });
    }
  }

  updateArticle(): void {
    const id = this.route.snapshot.paramMap.get('id'); // Get the ID from the route params

    // Call the updateArticle service method
    this.articleService.updateArticle(Number(id), this.article).subscribe(
      response => {
        console.log('Article updated:', response, this.article);
        
        // Show success toast
        this.showToast('Succès', 'Article mis à jour avec succès', 'success');
      },
      error => {
        console.error('Error updating article:', error);
        
        // Show error toast if something goes wrong
        this.showToast('Erreur', 'Échec de la mise à jour de l\'article', 'error');
      }
    );
  }

  // Method to show toast messages
  showToast(summary: string, detail: string, severity: string) {
    this.toastService.add({ severity: severity, summary: summary, detail: detail });
  }
  newTag: string = ''; 
  addTag(): void {
    if (this.newTag.trim() && !this.article.tags.includes(this.newTag.trim())) {
      this.article.tags.push(this.newTag.trim()); // Add the new tag
      this.newTag = ''; // Clear the input field
    } else {
      console.log('Tag is empty or already exists.');
    }
  }

    // Remove tag from the article
    removeTag(index: number): void {
      this.article.tags.splice(index, 1); // Remove the tag at the specified index
    }
}
