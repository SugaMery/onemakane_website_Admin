import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AnnonceService } from '../annonce.service';
import { UserService } from '../user.service';
import { Message } from 'primeng/api';

@Component({
  selector: 'app-list-ads',
  templateUrl: './list-ads.component.html',
  styleUrl: './list-ads.component.css'
})
export class ListAdsComponent {
  userData: any = {};
  adsCount: number = 0;
  ads: any;
  pagedCategories: any[] = [];
  selectedStatus: any = { value: 'all', label: 'Statut : tous' }; // Default to 'all' with label
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
  fetchDeleteReasons(): void {
    const accessToken = localStorage.getItem('loggedInUserToken');

    this.annonceService.getDeleteReasons(accessToken!).subscribe((data) => {
      this.deleteReasons = data.data;
    });
  }

  openDeleteDialog(ad: any): void {
    this.fetchDeleteReasons()

    this.selectedAd = ad;
    this.adDialog = true;
  }
  messages: Message[] = [];
  confirmDeletion(): void {
    const accessToken = localStorage.getItem('loggedInUserToken');
    this.annonceService.getAdsWithFavoris(this.selectedAd.user_id).subscribe((datas)=>{
      console.log('rtttt datassss',datas)
    });

    const selectedReason = (document.querySelector('input[name="reason"]:checked') as HTMLInputElement)?.value;
    if (selectedReason) {
      this.annonceService
        .deleteAd(this.selectedAd.id, this.selectedAd.uuid, Number(selectedReason), accessToken!)
        .subscribe(() => {
          this.ads = this.ads.filter((ad: any) => ad !== this.selectedAd);
          this.filteredAds = this.filteredAds.filter((ad: any) => ad !== this.selectedAd);
          this.adDialog = false;

          // Ajouter un message de succès
          this.messages = [{ severity: 'success', summary: 'Succès', detail: 'Annonce supprimée avec succès' }];

          // Effacer le message après 2 secondes
          setTimeout(() => {
            this.messages = [];
          }, 2000);
        });
    }
  }

  getAds(): void {
    this.annonceService.getAdsValidator("all").subscribe(
      data => {
        this.adsCount = data.data.length;
        this.ads = data.data;
        console.log("data",data.data);
        this.filteredAds = this.ads;
        this.applyFilter();
        this.setPagedCategories();
       

      },
      error => {
        console.error('Error fetching ads data', error);
      }
    );
  }

  itemsPerPage: number = 10; 
  currentPage: number = 1; 
  filteredAds :any=[]; // Array to store filtered ads

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
    console.log("filtrertttt",this.selectedStatus )

    if (this.selectedStatus.value === 'all')  {
      console.log("filtrerall",this.selectedStatus )

      this.filteredAds = this.ads;
    } else {
      console.log("filtrer",this.selectedStatus )
      this.filteredAds = this.ads.filter((ad: { validation_status: string; }) => ad.validation_status === this.selectedStatus.value);
    }
  }
  setCurrentPage(page: number) {
    this.currentPage = page;
    this.setPagedCategories();
  }
  get pages(): number[] {
    const pageCount = Math.ceil(
      this.ads.length / this.itemsPerPage
    );
    return Array.from({ length: pageCount }, (_, i) => i + 1);
  }
  setPagedCategories() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.pagedCategories = this.ads.slice(startIndex, endIndex);
    console.log("rrr",this.pagedCategories)
  }

  getInitials(firstName: string, lastName: string): string {
    const firstInitial = firstName.charAt(0).toUpperCase();
    const lastInitial = lastName.charAt(0).toUpperCase();
    return `${firstInitial}${lastInitial}`;
  }
}
