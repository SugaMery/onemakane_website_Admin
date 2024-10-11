import { Component } from '@angular/core';
import { TaxService } from '../tax.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-edit-taxes',
  templateUrl: './edit-taxes.component.html',
  styleUrl: './edit-taxes.component.css'
})
export class EditTaxesComponent {
  taxId: number = 0; // Renamed from roleId to taxId
  taxData = {
    name: '',
    rate: 0, // Changed from level to rate
    active: true,
  };

  constructor(
    private route: ActivatedRoute,
    private taxService: TaxService, // Changed to use TaxService
    private router: Router
  ) {}

  ngOnInit(): void {
    this.taxId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadTaxData();
  }

  loadTaxData(): void {
    const accessToken = localStorage.getItem('loggedInUserToken');

    // Implement logic to fetch the current tax data and populate taxData
    this.taxService.getTaxById(this.taxId,accessToken!).subscribe(
      (data) => {
        this.taxData = data; // Assuming the API returns a tax object
      },
      (error) => {
        console.error('Error fetching tax data', error);
      }
    );
  }

  updateTax(): void {
    const accessToken = localStorage.getItem('loggedInUserToken');
    this.taxService.updateTax(this.taxId, this.taxData, accessToken!).subscribe(
      (response) => {
        console.log('Tax updated successfully', response);
        this.router.navigate(['/gestion-taxes']); // Redirect after update
      },
      (error) => {
        console.error('Error updating tax', error);
      }
    );
  }
}
