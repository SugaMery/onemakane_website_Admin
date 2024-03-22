import { Component } from '@angular/core';
import { BackgroundImageService } from '../background-image.service';

@Component({
  selector: 'app-add-photo-website',
  templateUrl: './add-photo-website.component.html',
  styleUrl: './add-photo-website.component.css'
})
export class AddPhotoWebsiteComponent {

  imageName: string = '';
  imageFile: File | null = null;

  constructor(private backgroundImageService: BackgroundImageService) { }

  onFileSelected(event: any): void {
    this.imageFile = event.target.files[0];
  }

  uploadBackgroundImage(): void {
    if (!this.imageFile || !this.imageName) {
      console.error('Image name or file is missing');
      return;
    }

    const formData = new FormData();
    formData.append('name', this.imageName);
    formData.append('imageFile', this.imageFile);

    this.backgroundImageService.uploadBackgroundImage(formData)
      .subscribe(
        (response) => {
          console.log('Image uploaded successfully!', response);
          // Handle success response
        },
        (error) => {
          console.error('Error uploading image:', error);
          // Handle error response
        }
      );
  }

  saveBackgroundImageToDraft(): void {
    // Implement your logic for saving the background image to draft here
  }
}
