import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AnnonceService } from '../annonce.service';
import { Message } from 'primeng/api';

@Component({
  selector: 'app-annonces-approuvees',
  templateUrl: './annonces-approuvees.component.html',
  styleUrl: './annonces-approuvees.component.css'
})
export class AnnoncesApprouveesComponent {
  userData: any = {};
  adsCount: number = 0;
  ads: any;
  pagedCategories: any[] = [];
  selectedStatus: any = { value: 'all', label: 'Statut : tous' };
  statusOptions = [
    { value: 'all', label: 'Statut : tous' },
    { value: 'draft', label: 'Brouillon' },
    { value: 'pending', label: 'En attente' },
    { value: 'approved', label: 'Approuvé' },
    { value: 'rejected', label: 'Rejeté' }
  ];
  
  constructor(
    private route: ActivatedRoute,
    private annonceService: AnnonceService
  ) {}
  
  ngOnInit(): void {
    this.getAds();
  }
  
  adDialog: boolean = false;
  selectedAd: any;
  deleteReasons: any[] = [];
  messages: Message[] = [];
  itemsPerPage: number = 10;
  currentPage: number = 1;
  filteredAds: any[] = [];
  searchTerm: string = '';
  
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
  
  confirmDeletion(): void {
    const accessToken = localStorage.getItem('loggedInUserToken');
    const selectedReason = (document.querySelector('input[name="reason"]:checked') as HTMLInputElement)?.value;
    if (selectedReason) {
      this.annonceService
        .deleteAd(this.selectedAd.id, this.selectedAd.uuid, Number(selectedReason), accessToken!)
        .subscribe(() => {
          this.ads = this.ads.filter((ad: any) => ad !== this.selectedAd);
          this.filteredAds = this.filteredAds.filter((ad: any) => ad !== this.selectedAd);
          this.adDialog = false;
          this.messages = [{ severity: 'success', summary: 'Succès', detail: 'Annonce supprimée avec succès' }];
          setTimeout(() => {
            this.messages = [];
          }, 2000);
        });
    }
  }
  
  getAds(): void {
    this.annonceService.getAdsValidator("approved").subscribe(
      data => {
        this.adsCount = data.data.length;
        this.ads = data.data;
        this.filteredAds = this.ads;
        this.applyFilter();
        this.setPagedCategories();
      },
      error => {
        console.error('Error fetching ads data', error);
      }
    );
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
    if (this.selectedStatus.value === 'all') {
      this.filteredAds = this.ads;
    } else {
      this.filteredAds = this.ads.filter((ad: { validation_status: any; }) => ad.validation_status === this.selectedStatus.value);
    }
  
    if (this.searchTerm) {
      this.filteredAds = this.filteredAds.filter(ad =>
        ad.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        ad.description.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  
    this.setPagedCategories();
  }
  
  onSearch(event: any): void {
    this.searchTerm = event.target.value;
    this.applyFilter();
  }
  
  setCurrentPage(page: number) {
    this.currentPage = page;
    this.setPagedCategories();
  }
  
  get pages(): number[] {
    const pageCount = Math.ceil(this.ads.length / this.itemsPerPage);
    return Array.from({ length: pageCount }, (_, i) => i + 1);
  }
  
  setPagedCategories() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.pagedCategories = this.filteredAds.slice(startIndex, endIndex);
  }
  
  getInitials(firstName: string, lastName: string): string {
    const firstInitial = firstName.charAt(0).toUpperCase();
    const lastInitial = lastName.charAt(0).toUpperCase();
    return `${firstInitial}${lastInitial}`;
  }
  
}
