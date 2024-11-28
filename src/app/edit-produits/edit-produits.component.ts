import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { ProductsService } from '../products.service';
import { ActivatedRoute, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-edit-produits',
  templateUrl: './edit-produits.component.html',
  styleUrl: './edit-produits.component.css'
})
export class EditProduitsComponent {
  productData: any = { discounts: [] };

  activeTab: string = 'informations'; // Default active tab
  isPhone: boolean = false;
discount: any;
  constructor(private productsService: ProductsService, private router: Router, private route: ActivatedRoute, @Inject(PLATFORM_ID) private platformId: Object) {}
  closeModal() {
    // Logic to close the modal
    const modal = document.getElementById('specificPriceModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  }
  options: { label: string; value: any }[] = [];
  selectedReason: any;
  confirmationDialogVisible: boolean = false;
  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.isPhone = window.innerWidth <= 768;
    }
    this.loadProductData();
    const accessToken = localStorage.getItem('loggedInUserToken'); // Get your access token appropriately
    this.productsService.getDiscountReasons(accessToken!).subscribe((data) => {
      this.options = data.data.map((reason: { name: any; id: any; }) => ({ label: reason.name, value: reason.id }));
      console.log(this.options); // Check the options array structure
    });
  }

  
  loadProductData() {
    const productId = Number(this.route.snapshot.paramMap.get('id'));
    const accessToken = localStorage.getItem('loggedInUserToken');
    this.productsService.getProductById(productId, accessToken!).subscribe((data) => {
      this.productData = data.data;
      this.productData.tax = 20;
      console.log("tvvvv",this.productData)
      if (this.productData.created_at) {
        this.productData.created_at = this.formatDateToDatetimeLocal(this.productData.created_at);
      }
    });
  }
  onSubmit(): void {
    const productId = Number(this.route.snapshot.paramMap.get('id'));
    const accessToken = localStorage.getItem('loggedInUserToken');
    console.log("productData updated updated",this.productData);
    const informationsProduct = {
      name: this.productData.name,
      excerpt: this.productData.excerpt,
      description: this.productData.description,
      status: this.productData.status,  
      price : this.productData.price,
      sale_unit : this.productData.sale_unit
    }
    this.productsService.updateProduct(productId, informationsProduct, accessToken!).subscribe(
      response => {
        console.log('Product updated successfully:', response);
        // Handle success, e.g., redirect or show a success message
      },
      error => {
        console.error('Error updating product:', error);
        // Handle error, e.g., show an error message
      }
    );
  }
  formatDateToDatetimeLocal(dateString: string): string {
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16);
  }

  newDiscount: any = {
    name: '',
    startDate: null,
    startTime: null,
    endDate: null,
    endTime: null,
    reduction: null,
    reduction_type: '', // This will hold the selected type from dropdown
  };
  
  // Populate this with your discount reasons
  
  // Define the discount types with the specified options
  discountTypes: { label: string; value: string }[] = [
    { label: 'MAD', value: 'amount' },
    { label: '%', value: 'percentage' }
  ];

  priceDialogVisible: boolean = false; // To control dialog visibility
  discountDialogVisible: boolean = false; // To control dialog visibility
  confirmDialogVisible: boolean = false;
  discountToDeleteId: number | null = null;
  confirmDelete(discountId: number): void {
    this.discountToDeleteId = discountId; // Store the discount ID for deletion
    this.confirmDialogVisible = true; // Show confirmation dialog
  }

  deleteDiscount(): void {
    if (this.discountToDeleteId !== null) {
      const productId = Number(this.route.snapshot.paramMap.get('id'));
      const accessToken = localStorage.getItem('loggedInUserToken'); // Get your access token appropriately

      this.productsService.deleteDiscount(productId, this.discountToDeleteId, accessToken!).subscribe(
        response => {
          console.log('Discount deleted:', response);
          // Update the local discounts array
         this.loadProductData();
          this.discountToDeleteId = null; // Reset the ID
          this.confirmDialogVisible = false; // Close the dialog
        },
        error => {
          console.error('Error deleting discount:', error);
          this.confirmDialogVisible = false; // Close the dialog in case of error
        }
      );
    }
  }
  // Method to save the discount
  saveDiscount() {
    const accessToken = localStorage.getItem('loggedInUserToken'); // Get your access token appropriately
    const productId = 1; // Replace with the actual product ID
    // Create Date objects for start and end
    const startDateTime = new Date(this.newDiscount.startDate);
    startDateTime.setHours(this.newDiscount.startTime.getHours());
    startDateTime.setMinutes(this.newDiscount.startTime.getMinutes());

    const endDateTime = new Date(this.newDiscount.endDate);
    endDateTime.setHours(this.newDiscount.endTime.getHours());
    endDateTime.setMinutes(this.newDiscount.endTime.getMinutes());

    // Format the date as YYYY-MM-DD HH:mm:ss
    const formatDateTime = (date: Date): string => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        
        return `${year}-${month}-${day} ${hours}:${minutes}:00`;
    };

    const discountData = {
      name: this.newDiscount.name,
      start: formatDateTime(startDateTime), 
      end: formatDateTime(endDateTime),  
      discount_reason_id: this.selectedReason.value,
      reduction: this.newDiscount.reduction,
      reduction_type: this.newDiscount.reduction_type.value,
    };
console.log("discountData",discountData);
    this.productsService.createDiscount(productId, discountData, accessToken!).subscribe(response => {
      // Handle response
      console.log('Discount created:', response);
      this.loadProductData();
      this.hidePriceDialog(); // Close the dialog after saving
    });
  }

  // Open the dialog
  openPriceDialog() {
    this.priceDialogVisible = true;
  }

  // Close the dialog
  hidePriceDialog() {
    this.priceDialogVisible = false;
  }

  // Save the new discount



  calculateTTC(): string {
    if (this.productData.price && this.productData.tax) {
      const ttc = this.productData.price * (1 + this.productData.tax / 100);
      return ttc.toFixed(2).replace('.', ','); // Format the number with 2 decimal places and replace . with ,
    }
    return '0,00'; // Default return value if no price or tax is provided
  }
  
  

  setActiveTab(tab: string) {
    this.activeTab = tab; // Change the active tab
  }

  createProduct() {
    const accessToken = localStorage.getItem('loggedInUserToken');
    this.productsService.createProduct(this.productData, accessToken!).subscribe((response) => {
      console.log('Product created successfully!', response);
      this.router.navigate(['/produits']); // redirect after successful creation
    });
  }}
