import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CategoryService } from '../category.service';
import { DatePipe, isPlatformBrowser } from '@angular/common';
export interface Product {
  id?: string;
  code?: string;
  name?: string;
  description?: string;
  price?: number;
  quantity?: number;
  inventoryStatus?: string;
  category?: string;
  image?: string;
  rating?: number;
}
@Component({
  selector: 'app-list-category',
  templateUrl: './list-category.component.html',
  styleUrl: './list-category.component.css'
})
export class ListCategoryComponent implements OnInit {
  categories: any[] = [];
  parentCategories: any[] = []; // Assuming you have parent categories available
  filteredCategories: any[] = [];
  selectedDate: string = '';
  itemsPerPage: number = 7; // Number of items per page
  currentPage: number = 1; // Current page
  pagedCategories: any[] = []; // Array to hold categories for the current page
  selectedCategory: any; // Define this property in your component class
  selectedCategoryStatus: string ="";
  allCategories: any[] = []; // assuming this contains all category objects
  categoryStatuses: any[] =[];
  isFree: boolean = true; // Assuming the default is free
  parentCategorie: any[] = [];
  selectedParentCategory: any;
  date: Date | undefined;
  isPhone: boolean = false;

  getParentCategoryName(parentId: string): string {
    const parentCategory = this.categories.find(category => category.id === parentId);
    return parentCategory ? parentCategory.name : 'Pas de catégorie parente';
  }
  
  showDialog(category: any) {
    this.selectedCategory = category;
    this.selectedCategoryStatus = category.status;
    this.visible = true;

    console.log('Selected  category has a parent',this.selectedCategory.parent_id);
// Assuming formatCreated returns a string representation of the date
const formattedDateString: string = this.formatCreated(this.selectedCategory.created_at);

// Convert the formatted string to a Date object
if (formattedDateString) {
    this.date = new Date(formattedDateString);
} else {
    this.date = undefined;
}
    
    // Check if there's a selected category and set its parent category name as the default selection in the dropdown

    if (this.selectedCategory && this.selectedCategory.parent_id) {
      const foundCategory = this.parentCategories.find(cat => cat.value === this.selectedCategory.parent_id);
      if (foundCategory) {
          this.selectedParentCategory = foundCategory;
      }
  }else{
    this.selectedParentCategory = this.parentCategories.find(cat => cat.value === null);

  }

  }
  
  hideDialog() {
   this.selectedParentCategory="";
   this.visible = false;
}

  getSeverity(status: string): string {
    switch (status) {
      case 'ACTIVE':
        return 'success';
      case 'DRAFT':
        return 'warning';
      default:
        return '';
    }
  }

  visible: boolean = false;


  get pages(): number[] {
    const pageCount = Math.ceil(this.filteredCategories.length / this.itemsPerPage);
    return Array.from({ length: pageCount }, (_, i) => i + 1);
  }

  setCurrentPage(page: number) {
    this.currentPage = page;
    this.setPagedCategories();
  }
  filterByStatus(event: Event): void {
    const status = (event.target as HTMLSelectElement).value;
    if (status === 'ACTIVE' || status === 'DRAFT') {
        // Filter categories based on the selected status
        this.filteredCategories = this.categories.filter(category => category.status === status);
    } else {
        // Show all categories if 'Show all' option is selected or if no status is selected
        this.filteredCategories = this.categories;
    }
    // Reset pagination to the first page when applying filters
    this.currentPage = 1;
    this.setPagedCategories();
  }

  setPagedCategories() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.pagedCategories = this.filteredCategories.slice(startIndex, endIndex);
  }
  constructor(
    private categoryService: CategoryService,
    private datePipe: DatePipe,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { 
    this.parentCategorie = this.allCategories.filter(category => category.parent_id === null);
  }

  ngOnInit(): void {
    this.fetchCategories();
    this.setPagedCategories();
    this.categoryStatuses= [
      { label: 'DRAFT', value: 'DRAFT' },
      { label: 'ACTIVE', value: 'ACTIVE' }
    ];
    this.categoryService.getAllCategories().subscribe((categories: any[]) => {
      // Set all categories as parent categories initially
      this.parentCategories = [{ label: 'No Parent Category Selected', value: null }, ...categories.map(category => ({
        label: category.name,
        value: category.id
      }))];
        // Check if there's no selected parent category, then select "No Parent Category Selected"

    });

    if (isPlatformBrowser(this.platformId)) {
      this.isPhone = window.innerWidth <= 768;
    }
  }

  fetchCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.filteredCategories = this.categories; // Initialize filteredCategories
      },
      error: (error) => {
        console.error('Error fetching categories:', error);
      }
    });
  }

  searchByDate() {
    
    if (this.selectedDate) {
        // Filter categories based on the selected date
        this.filteredCategories = this.categories.filter(category => {
            // Assuming category.created_at is in 'YYYY/MM/DD' format
            const categoryDate = this.formatCreatedAt(category.created_at); // Extract date part only
            return categoryDate === this.selectedDate;
        });
    } else {
        // If no date is selected, show all categories
        this.filteredCategories = this.categories;
    }
}



  toggleAll(event: any) {
    const checkboxes = document.querySelectorAll('.itemlist input[type="checkbox"]');
    checkboxes.forEach((checkbox: any) => {
        checkbox.checked = event.target.checked;
    });
  }

  formatCreatedAt(date: string): string {
    return this.datePipe.transform(date, 'yyyy-MM-dd') || '';
  }


  formatCreated(date: string): string {
    return this.datePipe.transform(date, 'dd-MM-yyyy') || '';
  }
  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
        this.selectedCategory.icon_path = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  updateCategory(): void {
    this.categoryService.updateCategory(this.selectedCategory.id, this.selectedCategory)
      .subscribe(
        (response) => {
          console.log('Category updated successfully:', response);
          // Optionally, you can handle success response here
        },
        (error) => {
          console.error('Error updating category:', error);
          // Optionally, you can handle error response here
        }
      );
  }
}
