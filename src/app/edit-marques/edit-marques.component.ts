import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MarquesService } from '../marques.service';

@Component({
  selector: 'app-edit-marques',
  templateUrl: './edit-marques.component.html',
  styleUrl: './edit-marques.component.css'
})
export class EditMarquesComponent {
  brandId: number = 0; // To store the brand ID
  brandData = {
    name: '',
    slug: ''
  };

  constructor(
    private route: ActivatedRoute,
    private brandService: MarquesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.brandId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadBrandData();
  }

  loadBrandData(): void {
    const accessToken = localStorage.getItem('loggedInUserToken');
  
    // Fetch all brands
    this.brandService.getBrands(accessToken!).subscribe(
      (data) => {
        // Check if the data is structured as expected
        if (data && data.data) {
          // Filter to find the brand by its ID
          const foundBrand = data.data.find((brand: any) => brand.id === this.brandId);
          if (foundBrand) {
            this.brandData = foundBrand; // Populate brandData with the found brand
          } else {
            console.error('Brand not found');
          }
        } else {
          console.error('Unexpected data structure', data);
        }
      },
      (error) => {
        console.error('Error fetching brand data', error);
      }
    );
  }
  

  updateBrand(): void {
    const accessToken = localStorage.getItem('loggedInUserToken');
    this.brandService.updateBrand(this.brandId, this.brandData, accessToken!).subscribe(
      (response) => {
        console.log('Brand updated successfully', response);
        this.router.navigate(['/marques']); // Redirect after update
      },
      (error) => {
        console.error('Error updating brand', error);
      }
    );
  }
}
