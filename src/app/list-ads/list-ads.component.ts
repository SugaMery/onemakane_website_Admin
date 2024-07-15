import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AnnonceService } from '../annonce.service';
import { UserService } from '../user.service';

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
  constructor(
    private route: ActivatedRoute,
    private annonceService: AnnonceService
  ) {}

  ngOnInit(): void {
    this.getAds();
  }
  


  getAds(): void {
    this.annonceService.getAds().subscribe(
      data => {
        this.adsCount = data.data.length;
        this.ads = data.data;
        console.log("data",data.data);
        this.setPagedCategories();
      },
      error => {
        console.error('Error fetching ads data', error);
      }
    );
  }

  itemsPerPage: number = 10; 
  currentPage: number = 1; 

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
