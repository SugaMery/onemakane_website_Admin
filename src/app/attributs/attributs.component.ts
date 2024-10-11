import { Component } from '@angular/core';
import { AttributeService } from '../attribute.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-attributs',
  templateUrl: './attributs.component.html',
  styleUrl: './attributs.component.css'
})
export class AttributsComponent {
  attributes: any[] = []; // Variable to store fetched attributes

  constructor(
    private attributeService: AttributeService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const accessToken = localStorage.getItem('loggedInUserToken');
    this.loadAttributes(accessToken!);
  }

  // Load attributes from the service
  loadAttributes(accessToken: string): void {
    this.attributeService.getAttributes(accessToken).subscribe(
      (data) => {
        this.attributes = data.data; // Store fetched attributes
        console.log('Attributes loaded:', this.attributes); // Debugging log
      },
      (error) => {
        console.error('Error fetching attributes', error);
      }
    );
  }
}
