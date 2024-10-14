import { Component } from '@angular/core';
import { MarquesService } from '../marques.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-marques',
  templateUrl: './create-marques.component.html',
  styleUrl: './create-marques.component.css'
})
export class CreateMarquesComponent {
  brandData = {
    name: ''
  };

  constructor(
    private brandService: MarquesService,
    private router: Router
  ) {}

  createBrand(): void {
    const accessToken = localStorage.getItem('loggedInUserToken');
    
    // Call the service to create a new brand
    this.brandService.createBrand(this.brandData, accessToken!).subscribe(
      (response) => {
        console.log('Brand created successfully', response);
        this.router.navigate(['/marques']); // Redirect after creation
      },
      (error) => {
        console.error('Error creating brand', error);
      }
    );
  }
}
