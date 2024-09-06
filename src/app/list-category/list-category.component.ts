import {
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { CategoryService } from '../category.service';
import { DatePipe, isPlatformBrowser } from '@angular/common';
import { Console } from 'node:console';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { take } from 'rxjs/operators';
import { AnnonceService } from '../annonce.service';
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
  providers: [MessageService, ConfirmationService],
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
  selectedCategoryStatus: string = '';
  allCategories: any[] = []; // assuming this contains all category objects
  categoryStatuses: any[] = [];
  isFree: boolean = true; // Assuming the default is free
  parentCategorie: any[] = [];
  selectedParentCategory: any;
  date: Date | undefined;
  isPhone: boolean = false;
  date2: Date | undefined;
  visiblePages: number[] = [];
  isLastPageVisible: boolean = false;

  setCurrentPage(page: number): void {
    if (page < 1 || page > this.pages.length) return;
    this.currentPage = page;
    this.setPagedCategories();
    this.updateVisiblePages();
  }

  get pages(): number[] {
    const pageCount = Math.ceil(this.categories.length / this.itemsPerPage);
    return Array.from({ length: pageCount }, (_, i) => i + 1);
  }

  setPagedCategories(): void {
    //console.log("categoriescategoriescategoriescategories",this.categories)
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.pagedCategories = this.categories.slice(startIndex, endIndex);
  }

  updateVisiblePages(): void {
    const totalPages = this.pages.length;
    const maxVisiblePages = 5;
    const halfVisible = Math.floor(maxVisiblePages / 2);

    if (totalPages <= maxVisiblePages) {
      this.visiblePages = this.pages;
    } else {
      if (this.currentPage <= halfVisible) {
        this.visiblePages = this.pages.slice(0, maxVisiblePages);
      } else if (this.currentPage + halfVisible >= totalPages) {
        this.visiblePages = this.pages.slice(totalPages - maxVisiblePages, totalPages);
      } else {
        this.visiblePages = this.pages.slice(this.currentPage - halfVisible - 1, this.currentPage + halfVisible);
      }
    }

    this.isLastPageVisible = this.visiblePages.includes(totalPages);
  }
  getParentCategoryName(parentId: string): string {
    const parentCategory = this.categories.find(
      (category) => category.id === parentId
    );
    return parentCategory ? parentCategory.name : 'Pas de catégorie parente';
  }

  showDialog(category: any) {
    this.selectedCategory = category;
    this.selectedCategoryStatus = category.active === true ? 'ACTIVE' : 'DRAFT';

    this.visible = true;

    console.log('Selected  category has a parent', this.selectedCategory);
    // Assuming formatCreated returns a string representation of the date
    const formattedDateString: string = this.formatCreated(
      this.selectedCategory.created_at
    );

    // Convert the formatted string to a Date object
    if (formattedDateString) {
      this.date = new Date(formattedDateString);
    } else {
      this.date = undefined;
    }

    // Check if there's a selected category and set its parent category name as the default selection in the dropdown

    if (this.selectedCategory && this.selectedCategory.parent_id) {
      const foundCategory = this.parentCategories.find(
        (cat) => cat.value === this.selectedCategory.parent_id
      );
      if (foundCategory) {
        this.selectedParentCategory = foundCategory;
      }
    } else {
      this.selectedParentCategory = this.parentCategories.find(
        (cat) => cat.value === null
      );
    }
  }

  hideDialog() {
    this.selectedParentCategory = '';
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


  // Inside your component class
  statusOptions: SelectItem[] = [
    { label: 'Afficher tout', value: null },
    { label: 'Active', value: 'ACTIVE' },
    { label: 'Draft', value: 'DRAFT' },
  ];
  selectedStatus: any = { label: 'Afficher tout', value: null };


  constructor(
    private categoryService: CategoryService,
    private datePipe: DatePipe,
    @Inject(PLATFORM_ID) private platformId: Object,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private cdr: ChangeDetectorRef,
    private annonceService : AnnonceService
  ) {
    this.parentCategorie = this.allCategories.filter(
      (category) => category.parent_id === null
    );
  }

  ngOnInit(): void {
    if (typeof localStorage !== 'undefined') {
      this.fetchCategories();

      const accessToken = localStorage.getItem('loggedInUserToken');

      this.categoryStatuses = [
        { label: 'DRAFT', value: 'DRAFT' },
        { label: 'ACTIVE', value: 'ACTIVE' },
      ];
      this.categoryService.getCategoriesFrom(accessToken!).subscribe(
        (categories) => {
          const categoriesData = categories.data.slice(0, 7);

          categoriesData.forEach((category: any) => {
            this.categoryService
              .getCategoryById(category.id, accessToken!)
              .subscribe((category) => {
                this.pagedCategories.push(category.data);
              });
          });
          console.log('pagedCategories', this.pagedCategories);
        },
        (error) => {
          console.error('Error fetching categories:', error);
          // Handle error
        }
      );
      console.log('pagedCategoriesff', this.pagedCategories);

      console.log('tt', this.pagedCategories);
      this.categoryService
        .getCategoriesFrom(accessToken!)
        .subscribe((categories) => {
          const categoriesData = categories.data;
          // Set all categories as parent categories initially
          this.parentCategories = [
            { label: 'No Parent Category Selected', value: null },
            ...categoriesData.map((category: { name: any; id: any }) => ({
              label: category.name,
              value: category.id,
            })),
          ];
          // Check if there's no selected parent category, then select "No Parent Category Selected"
        });

      if (isPlatformBrowser(this.platformId)) {
        this.isPhone = window.innerWidth <= 768;
      }
    } else {
      // Handle the case when localStorage is not available
      console.warn(
        'localStorage is not available. Some functionalities may be limited.'
      );
    }
  }

  fetchCategories(): void {
    const accessToken = localStorage.getItem('loggedInUserToken');
    this.categoryService.getCategoriesFrom(accessToken!).subscribe({
      next: (categories) => {
        const categoriesData = categories.data;
        categoriesData.forEach((category: any) => {
          // Set all categories as parent categories initially
          this.categoryService
            .getCategoryById(category.id, accessToken!)
            .subscribe((categorys) => {
              this.categories.push(categorys.data);
              this.setPagedCategories();
              this.updateVisiblePages();
  
            });
        });
        this.filteredCategories = this.categories; // Initialize filteredCategories
      },
      error: (error) => {
        console.error('Error fetching categories:', error);
      },
    });
  }

  status: any;
  filterByStatus(event: any): void {
    console.log('teeertt', event.value.value);
    this.status = event.value.value;

    if (event.value.value) {
      if (this.selectedDate) {
        const status = event.value.value == 'ACTIVE' ? true : false;

        if (status == true || status == false) {
          console.log('filteredCategories', status);

          // Filter categories based on the selected status
          this.filteredCategories = this.filteredCategories.filter(
            (category) => category.active == status
          );
        }
      } else {
        const status = event.value.value == 'ACTIVE' ? true : false;

        if (status == true || status == false) {
          console.log('filteredCategories', status);

          // Filter categories based on the selected status
          this.filteredCategories = this.categories.filter(
            (category) => category.active == status
          );
        }
      }

      // Reset pagination to the first page when applying filters
      this.currentPage = 1;
      this.setPagedCategories();
    } else {
      console.log('filteredCategories non', status);
      // Show all categories if 'Show all' option is selected or if no status is selected
      this.filteredCategories = this.categories;
    }
  }
  searchByDate() {
    if (this.selectedDate) {
      console.log('statusssssssssss', this.status);
      if (this.status) {
        this.filteredCategories = this.filteredCategories.filter(
          (category) =>
            this.formatCreatedAt(category.created_at) ==
            this.formatCreatedAt(this.selectedDate)
        );
      } else {
        console.log('selectedDate', this.selectedDate);

        this.filteredCategories = this.categories.filter(
          (category) =>
            this.formatCreatedAt(category.created_at) ==
            this.formatCreatedAt(this.selectedDate)
        );
      }

      this.setPagedCategories();
    } else {
      // If no date is selected, show all categories
      this.filteredCategories = this.categories;
    }
  }

  deleteCategory(category: any) {
    this.annonceService.getAds().subscribe(
      (data) => {
        data.data.forEach((dataAnnonce: { id: string; })=>{
          this.annonceService.getAdById(dataAnnonce.id).subscribe((datas)=>{
             dataAnnonce = datas.data
          })
        })
        const filteredAds = data.data.filter((ad: any) => ad.category_id === category.id || ad.category.parent_id === category.id);
        const length = filteredAds.length;
        console.log('Filtered Ads:', filteredAds);
        console.log('Number of Ads for Category', category.id, ':', length);
      },
      (error) => {
        console.error('Error fetching ads:', error);
      }
    );
    
    this.confirmationService.confirm({
      message: 'Êtes-vous sûr de vouloir supprimer ?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Oui',
      rejectLabel: 'Non',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => {
        this.annonceService.getAds()
        this.categoryService.deleteCategory(category.id).subscribe(
          () => {
            this.pagedCategories = this.pagedCategories.filter(
              (c) => c.id !== category.id
            );
            this.filteredCategories = this.filteredCategories.filter(
              (c) => c.id !== category.id
            );
            // Reload the list of categories after successful deletion
            this.fetchCategories();
            console.log('Category :', this.pagedCategories);
            this.setPagedCategories();
            console.log('Category 2:', this.filteredCategories);
            this.messageService.add({
              severity: 'success',
              summary: 'Succès',
              detail: 'Catégorie supprimée',
              life: 3000,
            });

            // Manually trigger change detection
            this.cdr.detectChanges();
          },
          (error) => {
            console.error('Error deleting category:', error);
            // Handle error
          }
        );
      },
    });
  }
  toggleAll(event: any) {
    const checkboxes = document.querySelectorAll(
      '.itemlist input[type="checkbox"]'
    );
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
  icon_id: number = 0;
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

  onFileSelected(event: any): void {
    const file: File = (this.selectedFile = event.target.files[0]);

    this.resizeImage(file, 128, 128).then((resizedFile) => {
      this.selectedFile = resizedFile;

      const reader = new FileReader();
      reader.onload = () => {
        this.selectedCategory.media.url = reader.result as string;
        console.log("this.selectedCategory", this.selectedCategory);
      };
      reader.readAsDataURL(resizedFile);
    }).catch((error) => {
      console.error('Error resizing image:', error);
    });
  }

  updateCategory(): void {
    const accessToken = localStorage.getItem('loggedInUserToken');

    this.selectedCategory.status =
      this.selectedCategoryStatus === 'ACTIVE' ? 1 : 0;
    this.selectedCategory.parent_id = this.selectedParentCategory.value;
    const formData: any = {
      name: this.selectedCategory.name,
      parent_id: this.selectedParentCategory.value,
      type: this.selectedCategory.type,
      active: this.selectedCategoryStatus === 'ACTIVE' ? 1 : 0,
      icon_id: undefined, // Initialize icon_id as undefined
    };

    if (this.selectedFile) {
      this.categoryService.uploadFile(this.selectedFile, accessToken!)
        .then((response: { data: { id: any } }) => {
          formData.icon_id = response.data.id;
          this.categoryService.updateCategoryById(
            this.selectedCategory.id,
            formData,
            accessToken!
          ).subscribe(
            (response) => {
              this.messageService.add({
                severity: 'success',
                summary: 'Succès',
                detail: 'Catégorie modifiée avec succès',
                life: 3000,
              });
              console.log('updateCategoryById', formData, response);
              this.selectedCategory.active = formData.active;
              this.hideDialog();
              // window.location.reload(); // Refresh the page
            },
            (error) => {
              console.error('Error updating category:', error);
            }
          );
        })
        .catch((error: any) => {
          console.error('Error uploading file:', error);
          // Handle error
        });
    } else {
      delete formData.icon_id;
      this.categoryService.updateCategoryById(this.selectedCategory.id, formData, accessToken!)
        .subscribe(
          (response) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Succès',
              detail: 'Catégorie modifiée avec succès',
              life: 3000,
            });
            console.log('updateCategoryById', formData, response);
            this.selectedCategory.active = formData.active;
            this.hideDialog();
            // window.location.reload(); // Refresh the page
          },
          (error) => {
            console.error('Error updating category:', error);
          }
        );
    }
  }


  
}
