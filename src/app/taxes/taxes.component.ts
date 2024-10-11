import { Component } from '@angular/core';
import { TaxService } from '../tax.service';

@Component({
  selector: 'app-taxes',
  templateUrl: './taxes.component.html',
  styleUrl: './taxes.component.css'
})
export class TaxesComponent {
  taxes: any[] = [];
 

  constructor(private taxService: TaxService) {}

  ngOnInit(): void {
  
    this.fetchTaxes();
  }

  fetchTaxes(): void {
    const accessToken = localStorage.getItem('loggedInUserToken');

    this.taxService.getTaxes(accessToken!).subscribe(
      (response) => {
        this.taxes = response.data; // Process your response as needed
      },
      (error) => {
        console.error('Error fetching taxes:', error);
      }
    );
  }
}
