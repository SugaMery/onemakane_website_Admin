import { Component } from '@angular/core';
import { ProductsService } from '../products.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-produits',
  templateUrl: './create-produits.component.html',
  styleUrl: './create-produits.component.css'
})
export class CreateProduitsComponent {
  productData = {
    name: '',
    description: '',
    resume:'',
    user: 0
  };

  constructor(
    private productService: ProductsService,
    private router: Router
  ) {}

  createProduct(): void {
    const accessToken = localStorage.getItem('loggedInUserToken');
    const userId = localStorage.getItem('loggedInUserId');

    this.productData.user = Number(userId);

    this.productService.createProduct(this.productData, accessToken!).subscribe(
      (response) => {
        console.log('Produit ajouté avec succès', response);
        this.router.navigate(['/produits']); // Redirect to the product list after successful addition
      },
      (error) => {
        console.error('Erreur lors de l\'ajout du produit', error);
      }
    );
  }

  publishProduct(): void {
    // Implement the logic to publish the product
    this.createProduct(); // Call createProduct to handle the logic
    // Additional logic can be added here if needed
  }
}
