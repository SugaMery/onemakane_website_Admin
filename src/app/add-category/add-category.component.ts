import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { CategoryService } from '../category.service';
import { SelectItem } from 'primeng/api';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrl: './add-category.component.css',
})
export class AddCategoryComponent {
  categories: any[] = [];
  category: any = {};
  notSelected = null;
  selectedFile: File | null = null; // Variable to store the selected file
  categoryOptions: SelectItem[] = [];
  constructor(
    private categoryService: CategoryService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    // Fetch categories on component initialization
    this.fetchCategories();
    this.fetchData();
    this.categoryOptions = this.categories;
  }

  fetchData() {
    this.fetchCategories();
  }

  fetchCategories() {
    if (isPlatformBrowser(this.platformId)) {
      const accessToken = localStorage.getItem('loggedInUserToken');
      if (accessToken) {
        this.categoryService.getCategoriesFrom(accessToken).subscribe({
          next: (categories) => {
            console.log('Categories fetched successfully:', categories);
          // Assuming categories.data is the array you are working with
          this.categories = categories.data.filter((category: { active: boolean; }) => category.active == true);
          },
          error: (error) => {
            console.error('Error fetching categories:', error);
          },
        });
      }
    }
  }
  resizeImage(file: File, width: number, height: number): Promise<File> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event: any) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (ctx) {
            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);

            canvas.toBlob((blob) => {
              if (blob) {
                const resizedFile = new File([blob], file.name, {
                  type: file.type,
                  lastModified: file.lastModified,
                });
                resolve(resizedFile);
              } else {
                reject('Could not resize image.');
              }
            }, file.type);
          } else {
            reject('Could not get canvas context.');
          }
        };
        img.src = event.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0]; // Get the selected file
    this.resizeImage(file, 128, 128).then((resizedFile) => {
      this.selectedFile = resizedFile;
    }).catch((error) => {
      console.error('Error resizing image:', error);
    });
  }

  addCategory(): void {
    const accessToken = localStorage.getItem('loggedInUserToken');
    console.log(`Media uploaded successfully2: `, this.selectedFile?.name);

    if (!this.selectedFile) {
      console.error('No file selected');
      return;
    }

    this.categoryService.uploadFile(this.selectedFile, accessToken!)
      .then((mediaResponse: any) => {
        const icon_id = mediaResponse.data.id;
        console.log(`Media uploaded successfully: ${icon_id}`, mediaResponse);

        const formData = {
          icon_id: icon_id,
          name: this.category.name,
          parent_id: this.category.parent_id,
          type: this.category.type,
          active: 1,
        };
        console.log('formData ADMIN OneMakane', formData);

        this.categoryService.createCategory(formData, accessToken!).subscribe({
          next: (response) => {
            this.selectedFile = null;
            console.log('Category added successfully:');
            this.category = {}; // Reset form fields after successful submission
            this.fetchCategories(); // Fetch updated categories

            // Reset file input field to null
            const fileInput = document.getElementById('icon_path') as HTMLInputElement;
            fileInput.value = ''; // Reset the value to empty string
          },
          error: (error) => {
            console.error('Error adding category:', error);
          },
        });
      })
      .catch((error) => {
        console.error('Error uploading file:', error);
      });
  }

  addCategoryToDraft(): void {
    const accessToken = localStorage.getItem('loggedInUserToken');
    console.log(`Media uploaded successfully2: `, this.selectedFile?.name);

    if (!this.selectedFile) {
      console.error('No file selected');
      return;
    }

    this.categoryService.uploadFile(this.selectedFile, accessToken!)
      .then((mediaResponse: any) => {
        const icon_id = mediaResponse.data.id;
        console.log(`Media uploaded successfully: ${icon_id}`, mediaResponse);

        const formData = {
          icon_id: icon_id,
          name: this.category.name,
          parent_id: this.category.parent_id,
          type: this.category.type,
          active: 0,
        };
        console.log('formData ADMIN OneMakane', formData);

        this.categoryService.createCategory(formData, accessToken!).subscribe({
          next: (response) => {
            this.selectedFile = null;
            console.log('Category added successfully:');
            this.category = {}; // Reset form fields after successful submission
            this.fetchCategories(); // Fetch updated categories

            // Reset file input field to null
            const fileInput = document.getElementById('icon_path') as HTMLInputElement;
            fileInput.value = ''; // Reset the value to empty string
          },
          error: (error) => {
            console.error('Error adding category:', error);
          },
        });
      })
      .catch((error) => {
        console.error('Error uploading file:', error);
      });
  }
}
