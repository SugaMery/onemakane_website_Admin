import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AnnonceService } from '../annonce.service';
import { Message } from 'primeng/api';
import { Category1Service } from '../category1.service';

@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrl: './jobs.component.css'
})
export class JobsComponent {
  userData: any = {};
  adsCount: number = 0;
  ads: any[] = [];
  filteredAds: any[] = [];
  pagedAds: any[] = [];
  showJobOffersTab = false;
  categories: any[] = [];
  adDialog: boolean = false;
  selectedAd: any;
  deleteReasons: any[] = [];
  messages: Message[] = [];
  selectedStatus: any = { value: 'all', label: 'Statut : tous' };
  statusOptions = [
    { value: 'all', label: 'Statut : tous' },
    { value: 'draft', label: 'Brouillon' },
    { value: 'pending', label: 'En attente' },
    { value: 'approved', label: 'Approuvé' },
    { value: 'rejected', label: 'Rejeté' }
  ];
  itemsPerPage: number = 10; // Updated to show 6 items per page
  currentPage: number = 1;
  searchTerm: string = '';
  constructor(
    private route: ActivatedRoute,
    private annonceService: AnnonceService,
    private categoryService: Category1Service,
  ) {}

  ngOnInit(): void {
   
    this.categoryService.getCategoryTree().subscribe((data) => {
      this.categories = data;
      this.getAds();
      console.log('categorient parent', this.categories);
    });

  }

  getAds(): void {
    this.annonceService.getAllAdsValidator("all").subscribe(
      data => {
        //this.ads = data;

           // Find the parent category with id 140
    const parentCategory = this.categories.find(
      (category) => category.id === '140'
    );
    if (parentCategory && parentCategory.children) {
      // Get all child category ids
      const childCategoryIds = parentCategory.children.map(
        (child: { id: any }) => child.id
      );
      // Check if any ad has a category_id that matches one of the child categories
      this.showJobOffersTab = data.some((ad) =>
        childCategoryIds.includes(ad.category_id.toString())
      );
      this.filteredAds = data.filter((ad) =>
        childCategoryIds.includes(ad.category_id.toString())
      );
      this.ads=this.filteredAds;

      // Log the result for debugging
      console.log('Show Job Offers Tab:', this.showJobOffersTab,this.filteredAds,this.ads);
      // Check if any ad has a category_id that matches one of the child categories
    }

        //this.filteredAds = this.ads;
        //this.checkIfShowJobOffersTab();
        this.applyFilter();
      },
      error => {
        console.error('Error fetching ads data', error);
      }
    );
  }
  
  fetchDeleteReasons(): void {
    const accessToken = localStorage.getItem('loggedInUserToken');
    this.annonceService.getDeleteReasons(accessToken!).subscribe((data) => {
      this.deleteReasons = data.data;
    });
  }

  openDeleteDialog(ad: any): void {
    this.fetchDeleteReasons();
    this.selectedAd = ad;
    this.adDialog = true;
  }

  checkIfShowJobOffersTab(): void {
    // Find the parent category with id 140
    const parentCategory = this.categories.find(
      (category) => category.id === '140'
    );
    if (parentCategory && parentCategory.children) {
      // Get all child category ids
      const childCategoryIds = parentCategory.children.map(
        (child: { id: any }) => child.id
      );
      // Check if any ad has a category_id that matches one of the child categories
      this.showJobOffersTab = this.ads.some((ad) =>
        childCategoryIds.includes(ad.category_id.toString())
      );
      this.filteredAds = this.ads.filter((ad) =>
        childCategoryIds.includes(ad.category_id.toString())
      );
      this.ads=this.filteredAds;

      // Log the result for debugging
      console.log('Show Job Offers Tab:', this.showJobOffersTab,this.filteredAds,this.ads);
      // Check if any ad has a category_id that matches one of the child categories
    }
  }
  
  confirmDeletion(): void {
    const accessToken = localStorage.getItem('loggedInUserToken');
    this.annonceService.getAdsWithFavoris(this.selectedAd.user_id).subscribe((datas) => {
      console.log('rtttt datassss', datas);
    });

    const selectedReason = (document.querySelector('input[name="reason"]:checked') as HTMLInputElement)?.value;
    if (selectedReason) {
      this.annonceService
        .deleteAd(this.selectedAd.id, this.selectedAd.uuid, Number(selectedReason), accessToken!)
        .subscribe(() => {
          this.ads = this.ads.filter((ad: any) => ad !== this.selectedAd);
          this.filteredAds = this.filteredAds.filter((ad: any) => ad !== this.selectedAd);
          this.setPagedAds(); // Update paged ads after deletion
          this.adDialog = false;

          this.messages = [{ severity: 'success', summary: 'Succès', detail: 'Annonce supprimée avec succès' }];

          setTimeout(() => {
            this.messages = [];
          }, 2000);
        });
    }
  }
  get visiblePages(): number[] {
    const totalPages = this.pages;
    const pageCount = totalPages.length;

    if (pageCount <= 5) {
      return totalPages; // Show all pages if there are 5 or fewer
    }

    const currentPage = this.currentPage;
    const range = 2; // Number of pages to show before and after the current page
    let start = Math.max(currentPage - range, 1);
    let end = Math.min(currentPage + range, pageCount);

    if (end - start < 2 * range) {
      start = Math.max(end - 2 * range, 1);
    }

    return totalPages.slice(start - 1, end);
  }

  get isLastPageVisible(): boolean {
    return this.pages.includes(this.pages.length);
  }

  filterByStatus(event: any) {
    const selectedValue = event.value.value;
    this.selectedStatus = this.statusOptions.find(option => option.value === selectedValue);
    this.applyFilter();
  }

  onStatusChange(event: any) {
    const selectedValue = event.target.value;
    this.selectedStatus = this.statusOptions.find(option => option.value === selectedValue);
    this.applyFilter();
  }

  applyFilter() {
    // Start by filtering based on status
    if (this.selectedStatus.value === 'all') {
      this.filteredAds = this.ads;
    } else {
      this.filteredAds = this.ads.filter(
        (ad: { validation_status: string }) =>
          ad.validation_status === this.selectedStatus.value
      );
    }
  
    // Further filter the results based on the search term
    if (this.searchTerm.trim() !== '') {
      const lowerCaseSearchTerm = this.searchTerm.toLowerCase();
      this.filteredAds = this.filteredAds.filter(
        (ad: { title: string; description: string }) =>
          ad.title.toLowerCase().includes(lowerCaseSearchTerm) ||
          ad.description.toLowerCase().includes(lowerCaseSearchTerm)
      );
    }
  
    this.setPagedAds(); // Update paged ads after filtering
  }
  

  setCurrentPage(page: number) {
    this.currentPage = page;
    this.setPagedAds();
  }

  get pages(): number[] {
    const pageCount = Math.ceil(
      this.filteredAds.length / this.itemsPerPage
    );
    return Array.from({ length: pageCount }, (_, i) => i + 1);
  }

  setPagedAds() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.pagedAds = this.filteredAds.slice(startIndex, endIndex);
  }

  
  pagedCategories: any[] = [];

  getInitials(firstName: string, lastName: string): string {
    const firstInitial = firstName.charAt(0).toUpperCase();
    const lastInitial = lastName.charAt(0).toUpperCase();
    return `${firstInitial}${lastInitial}`;
  }
}