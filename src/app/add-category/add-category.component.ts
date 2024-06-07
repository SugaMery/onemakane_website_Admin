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

  addCategory(): void {
    const accessToken = localStorage.getItem('loggedInUserToken');
    console.log(`Media uploaded successfully2: `, this.selectedFile?.name);
    this.categoryService
      .uploadFile(this.selectedFile!, accessToken!)
      .then((mediaResponse) => {
        const icon_id = mediaResponse.id;
        console.log(
          `Media uploaded successfully: ${mediaResponse.data.id}`,
          mediaResponse
        );
        const active = 0;
        const formData = {
          icon_id: mediaResponse.data.id,
          name: this.category.name,
          parent_id: this.category.parent_id,
          type: this.category.type,
          active: 1,
        };
        console.log('formData ADMIN OneMakane', formData);
        // Send the FormData containing both category details and file data
        this.categoryService.createCategory(formData, accessToken!).subscribe({
          next: (response) => {
            this.selectedFile = null;
            console.log('Category added successfully:');
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
      })
      .catch((error) => {
        console.error('Error uploading file:', error);
      });
  }

  addCategoryToDraft(): void {
    const accessToken = localStorage.getItem('loggedInUserToken');
    console.log(`Media uploaded successfully2: `, this.selectedFile?.name);
    this.categoryService
      .uploadFile(this.selectedFile!, accessToken!)
      .then((mediaResponse) => {
        const icon_id = mediaResponse.id;
        console.log(
          `Media uploaded successfully: ${mediaResponse.data.id}`,
          mediaResponse
        );
        const active = 0;
        const formData = {
          icon_id: mediaResponse.data.id,
          name: this.category.name,
          parent_id: this.category.parent_id,
          type: this.category.type,
          active: 0,
        };
        console.log('formData ADMIN OneMakane', formData);
        // Send the FormData containing both category details and file data
        this.categoryService.createCategory(formData, accessToken!).subscribe({
          next: (response) => {
            this.selectedFile = null;
            console.log('Category added successfully:');
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
      })
      .catch((error) => {
        console.error('Error uploading file:', error);
      });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0]; // Get the selected file
  }
}
