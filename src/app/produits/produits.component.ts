import { Component } from '@angular/core';
import { ProductsService } from '../products.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-produits',
  templateUrl: './produits.component.html',
  styleUrl: './produits.component.css'
})
export class ProduitsComponent {
products: any[] = []; // Array to hold the list of products

  constructor(
    private productService: ProductsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }
 // Method to get the status in French
 getStatusLabel(status: string): string {
  switch (status) {
    case 'draft':
      return 'Brouillon';
    case 'approved':
      return 'En ligne';
    case 'pending':
      return 'En attente';
    case 'rejected':
      return 'Rejeté';
    default:
      return 'Inconnu';
  }
}

// Method to join categories with 'et'
getCategoriesString(categories: any[]): string {
  return categories && categories.length > 0 ? categories.map(cat => cat.name).join(' et ') : 'Aucune catégorie';
}
  loadProducts(): void {
    const accessToken = localStorage.getItem('loggedInUserToken');

    this.productService.getProducts(accessToken!).subscribe(
      (data) => {
        this.products = data.data; // Assuming the API returns an array of products
      },
      (error) => {
        console.error('Error fetching products', error);
      }
    );
  }
}
