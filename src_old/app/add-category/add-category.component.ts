import { Component } from '@angular/core';
import { CategoryService } from '../category.service';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrl: './add-category.component.css'
})
export class AddCategoryComponent {
  categories: any[] = [];
  category: any = {};
  notSelected=null;
  selectedFile: File | null = null; // Variable to store the selected file

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    // Fetch categories on component initialization
    this.fetchCategories();
    this.fetchData();
  }

  fetchData() {
    this.fetchCategories();
  }
  fetchCategories() {
    this.categoryService.getAllCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        console.error('Error fetching categories:', error);
      }
    });
  }

  addCategory(): void {
    // Check if a file is selected
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('file', this.selectedFile); // Append the file to FormData
      formData.append('name', this.category.name);
      formData.append('parent_id', this.category.parent_id);
      formData.append('type', this.category.type);
      
      // Send the FormData containing both category details and file data
      this.categoryService.addCategory(formData).subscribe({
        next: (response) => {
          this.selectedFile = null ; 
          console.log('Category added successfully:', );
          // Reset form fields after successful submission if needed
          this.category = {};
          this.fetchCategories(); // Fetch updated categories
  
          // Reset file input field to null
          const fileInput = document.getElementById('icon_path') as HTMLInputElement;
          fileInput.value = ''; // Reset the value to empty string
        },
        error: (error) => {
          console.error('Error adding category:', error);
        }
      });
    }
  }
  

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0]; // Get the selected file
  }
}
