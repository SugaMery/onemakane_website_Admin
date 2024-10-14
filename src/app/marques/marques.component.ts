import { Component } from '@angular/core';
import { MarquesService } from '../marques.service';

@Component({
  selector: 'app-marques',
  templateUrl: './marques.component.html',
  styleUrl: './marques.component.css'
})
export class MarquesComponent {
  brands: any[] = [];

  constructor(private brandService: MarquesService) {}

  ngOnInit(): void {
    const accessToken = localStorage.getItem('loggedInUserToken');
    this.loadBrands(accessToken!);
  }

  loadBrands(accessToken: string): void {
    this.brandService.getBrands(accessToken).subscribe(
      (data) => {
        this.brands = data.data; // Adapt this line based on your API response structure
        console.log("Loaded brands", data.data);
      },
      (error) => {
        console.error('Error loading brands:', error);
      }
    );
  }

  editBrand(brand: any) {
    // Logic to edit the brand
    console.log('Edit brand:', brand);
  }

  deleteBrand(brand: any) {
    // Logic to delete the brand
    console.log('Delete brand:', brand);
    // Call a delete method from the BrandService if needed
  }
}
