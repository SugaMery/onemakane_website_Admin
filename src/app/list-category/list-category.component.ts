import { ChangeDetectorRef, Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CategoryService } from '../category.service';
import { DatePipe, isPlatformBrowser } from '@angular/common';
import { Console } from 'node:console';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { take } from 'rxjs/operators';
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
  styleUrl: './list-category.component.css',
  providers: [MessageService, ConfirmationService]
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
  date2: Date | undefined;
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
// Inside your component class
statusOptions: SelectItem[] = [
  { label: 'Afficher tout', value: null },
  { label: 'Active', value: 'ACTIVE' },
  { label: 'Draft', value: 'DRAFT' },
];
selectedStatus: any = { label: 'Afficher tout', value: null };


filterByStatus(event: any): void {
  console.log('teeertt',event.value.value);
  const status = event.value.value;
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
    @Inject(PLATFORM_ID) private platformId: Object,
    private messageService: MessageService, private confirmationService: ConfirmationService,
    private cdr: ChangeDetectorRef
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
    this.categoryService.getAllCategories().subscribe(
      (categories: any[]) => {
        this.pagedCategories = categories.slice(0, 7);
      },
      error => {
        console.error('Error fetching categories:', error);
        // Handle error
      }
    );
    
    
    console.log("tt",this.pagedCategories);
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
            return categoryDate === this.formatCreatedAt(this.selectedDate) ;
        });
    } else {
        // If no date is selected, show all categories
        this.filteredCategories = this.categories;
    }
}

deleteCategory(category: any) {
  this.confirmationService.confirm({
    message: 'Êtes-vous sûr de vouloir supprimer ?',
    header: 'Confirmation',
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: 'Oui',
    rejectLabel: 'Non',
    rejectButtonStyleClass:"p-button-text",
    accept: () => {
      this.categoryService.deleteCategory(category.id).subscribe(
        () => {
          this.pagedCategories = this.pagedCategories.filter(c => c.id !== category.id);
          this.filteredCategories = this.filteredCategories.filter(c => c.id !== category.id);
          // Reload the list of categories after successful deletion
          this.fetchCategories();
          console.log('Category :', this.pagedCategories);
          this.setPagedCategories();
          console.log('Category 2:', this.filteredCategories);
          this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Catégorie supprimée', life: 3000 });

          // Manually trigger change detection
          this.cdr.detectChanges();
        },
        error => {
          console.error('Error deleting category:', error);
          // Handle error
        }
      );
    }
  });
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
  selectedFile: File | null = null; // Variable to store the selected file

  updateCategory(): void {

    this.selectedCategory.status= this.selectedCategoryStatus;
    this.selectedCategory.parent_id =this.selectedParentCategory.value;
    const formData = new FormData();
    formData.append('name', this.selectedCategory.name);
    formData.append('parent_id', this.selectedParentCategory.value);
    formData.append('type', this.selectedCategory.type);
    formData.append('status', this.selectedCategoryStatus);
    if (this.selectedFile) {
        formData.append('file', this.selectedFile!);
    }else{
      formData.append('file', this.selectedCategory.icon_path);
    }

    this.categoryService.updateCategory(this.selectedCategory.id, formData)
      .subscribe(
        (response) => {
          this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Catégorie modifiée avec succès', life: 3000 });
          console.log('Category updated successfully:', response);
          this.hideDialog();
          //window.location.reload(); // Refresh the page
        },
        (error) => {
          console.error('Error updating category:', error);
        }
      );
}




onFileSelected(event: any): void {
  const file: File = this.selectedFile=event.target.files[0];
  
  const reader = new FileReader();
  reader.onload = () => {
      this.selectedCategory.icon_path = reader.result as string;
  };
  reader.readAsDataURL(file);
}
}
