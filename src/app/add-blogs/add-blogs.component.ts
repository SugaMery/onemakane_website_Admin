import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { BlogsService } from '../blogs.service';

@Component({
  selector: 'app-add-blogs',
  templateUrl: './add-blogs.component.html',
  styleUrl: './add-blogs.component.css',
})
export class AddBlogsComponent {
  article = {
    title: '',
    by: '',
    content: '',
    image: '',
    views: '',
    shares: '',
    tags: [] as string[], // Ensure tags are of type string[]
    authorBox: {
      authorName: '',
      authorImage: '',
      authorLink: '',
      authorPosts: '',
      authorSince: '',
      authorDescription: '',
    },
    comments: [{ user: '', comment: '', date: '' }],
    date: new Date().toLocaleDateString(),
    link: '',
    fullContent: '',
  };

  newTag: string = '';
  selectedImageFile: File | null = null;
  selectedAuthorImageFile: File | null = null;

  constructor(
    private articleService: BlogsService,
    private confirmationService: ConfirmationService,
    private toastService: MessageService,
    private http: HttpClient
  ) {}

  addTag(): void {
    const trimmedTag = this.newTag.trim();
    if (trimmedTag && !this.article.tags.includes(trimmedTag)) {
      this.article.tags.push(trimmedTag);
      this.newTag = ''; // Clear the input after adding the tag
    }
  }

  removeTag(index: number): void {
    this.article.tags.splice(index, 1);
  }

  onImageChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedImageFile = file; // Store the selected file for upload
    }
  }

  onAuthorImageChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedAuthorImageFile = file; // Store the selected file for upload
    }
  }

  uploadImage(file: File, accessToken: string): Promise<any> {
    const formData = new FormData();
    formData.append('media_file', file);

    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
    });

    return this.http
      .post<any>('https://restapi.onemakan.com/v1/medias', formData, {
        headers,
      })
      .toPromise();
  }

  async submitArticle(): Promise<void> {
    try {
      const accessToken = localStorage.getItem('loggedInUserToken');

      // Upload the main image
      if (this.selectedImageFile) {
        const imageUploadResponse = await this.uploadImage(
          this.selectedImageFile,
          accessToken!
        );
        console.log("data.url_thumbnailimageUploadResponse",imageUploadResponse)
        this.article.image = imageUploadResponse.data.url_thumbnail; // Set the uploaded image URL
      }

      // Upload the author image
      if (this.selectedAuthorImageFile) {
        const authorImageUploadResponse = await this.uploadImage(
          this.selectedAuthorImageFile,
          accessToken!
        );
        console.log("data.url_thumbnailimageUploadResponse",authorImageUploadResponse)

        this.article.authorBox.authorImage = authorImageUploadResponse.data.url_thumbnail; // Set the uploaded author image URL
      }

      this.article.views= this.article.views + "k"
      this.article.shares= this.article.shares + "k"

      // Submit the article
      this.articleService.addArticle(this.article).subscribe(
        (data) => {
          const articleId = data.id; // Assuming the backend returns the article ID
            const slug = this.slugify(this.article.title);
            const link = `https://onemakan.ma/blogs/${articleId}/${slug}`;
            console.log('slufffffffffff',slug,link,articleId)
    // Call the updateArticle service method

    const articleUpdate ={
      link: link,
      authorBox: {
        authorImage: link,
      }
    }

    
    this.articleService.updateArticles(Number(articleId), articleUpdate).subscribe(
      response => {
        console.log('Article updated:', response, this.article);
        
        // Show success toast
      },
      error => {
        console.error('Error updating article:', error);
        
        // Show error toast if something goes wrong
      }
    );


          this.toastService.add({
            severity: 'success',
            summary: 'Article Added',
            detail: 'Your article has been added successfully!',
          });
          console.log('Article submitted successfully', data,slug,link,articleId);
        },
        (error) => {
          console.error('Error submitting article', error);
          this.toastService.add({
            severity: 'error',
            summary: 'Submission Failed',
            detail: 'There was an error submitting your article.',
          });
        }
      );
    } catch (error) {
      console.error('Error uploading images or submitting article', error);
      this.toastService.add({
        severity: 'error',
        summary: 'Upload Failed',
        detail: 'There was an error uploading images or submitting your article.',
      });
    }
  }

  // Utility function to create a slug from the title
  slugify(title: string): string {
    return title
      .toLowerCase()
      .normalize('NFD') // Decomposes combined characters into base and diacritic
      .replace(/[\u0300-\u036f]/g, '') // Removes all diacritic marks
      .trim()
      .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric characters with hyphens
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
  }
  
}
