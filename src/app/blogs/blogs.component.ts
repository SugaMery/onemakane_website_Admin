import { Component } from '@angular/core';
import { BlogsService } from '../blogs.service';
import { Article } from '../article.module';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-blogs',
  templateUrl: './blogs.component.html',
  styleUrl: './blogs.component.css'
})
export class BlogsComponent {
  articles: Article[] = [];
accept: any;
reject: any;

  constructor(private articleService: BlogsService,private confirmationService: ConfirmationService, private toastService: MessageService) {}

  ngOnInit(): void {
    this.getArticles();
  }
  // Fonction pour modifier un article
  modifierArticle(articleId: number): void {
    console.log('Modifier l\'article avec ID:', articleId);
    // Ajoutez la logique pour rediriger ou ouvrir un formulaire de modification
  }

  // Open confirmation dialog
  confirmDelete(article :any) {
    this.confirmationService.confirm({
      message: 'Êtes-vous sûr de vouloir supprimer cet article ?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        // Handle the delete logic here
        //this.deleteArticle();  // Call delete function
      },
      reject: () => {
        // Handle rejection if needed
        this.showToast('Annulé', 'Suppression annulée', 'warn');
      }
    });
  }


  
  confirmDeactivation(article :any): void {
    this.confirmationService.confirm({
      message: 'Êtes-vous sûr de vouloir supprimer cet article?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Oui',
      rejectLabel: 'Non',
      accept: () => this.deleteArticle(article),
      reject: () => this.toastService.add({severity: 'info', summary: 'Annulé', detail: 'L\'action a été annulée.'})
    });
  }


  // Delete the article (example)
  deleteArticle(article : any) {
    // Example: Delete the article here (replace with actual delete logic)
    console.log('Article deleted');
    this.showToast('Succès', 'Article supprimé avec succès', 'success');
    this.articleService.deleteArticle(article.id).subscribe((data)=>{
      this.articles = this.articles.filter(a => a.id !== article.id);
    });
  }

  // Show Toast message
  showToast(summary: string, detail: string, severity: string) {
    this.toastService.add({ severity: severity, summary: summary, detail: detail });
  }

  getArticles(): void {
    this.articleService.getArticles().subscribe((articles) => {
      this.articles = articles;
    });
  }
}
