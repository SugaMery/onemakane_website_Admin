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
            this.categories = categories.data;
          },
          error: (error) => {
            console.error('Error fetching categories:', error);
          },
        });
      }
    }
  }

  addCategory(): void {
    const accessToken = localStorage.getItem('loggedInUserToken');
    console.log(`Media uploaded successfully2: `, this.selectedFile?.name);
    this.categoryService
      .uploadImages(this.selectedFile?.name, accessToken!)
      .subscribe({
        next: (mediaResponse) => {
          const icon_id = mediaResponse.id;
          console.log(
            `Media uploaded successfully: ${mediaResponse.id}`,
            mediaResponse
          );
        },
      });

    // Check if a file is selected
  }

  addCategoryToDraft(): void {
    const accessToken = localStorage.getItem('loggedInUserToken');
    // Check if a file is selected
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('file', this.selectedFile); // Append the file to FormData
      formData.append('name', this.category.name);
      formData.append('parent_id', this.category.parent_id);
      formData.append('type', this.category.type);
      formData.append('status', 'DRAFT');

      // Send the FormData containing both category details and file data
      this.categoryService.uploadImages(formData, accessToken!).subscribe({
        next: (mediaResponse) => {
          const icon_id = mediaResponse.id; // Assuming the response contains the ID of the uploaded media
          formData.append('icon_id', icon_id); // Append the icon ID to the form data

          // Create the category with the icon ID included
          this.categoryService
            .createCategory(formData, accessToken!)
            .subscribe({
              next: (response) => {
                this.selectedFile = null;
                console.log('Category added successfully:', response);
                // Reset form fields after successful submission if needed
                this.category = {};
                this.fetchCategories(); // Fetch updated categories

                // Reset file input field to null
                const fileInput = document.getElementById(
                  'icon_path'
                ) as HTMLInputElement;
                fileInput.value = ''; // Reset the value to empty string
              },
              error: (error) => {
                console.error('Error adding category:', error);
              },
            });
        },
        error: (error) => {
          console.error('Error uploading media:', error);
        },
      });
    }
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0]; // Get the selected file
  }
}
