import { Component } from '@angular/core';
import { AttributeService } from '../attribute.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-edit-attributs',
  templateUrl: './edit-attributs.component.html',
  styleUrl: './edit-attributs.component.css'
})
export class EditAttributsComponent {
  attribute: any = {
    attribute_values: [] // Initialize attribute_values as an empty array
  };
  attributeId: string | null = null;

  constructor(
    private attributeService: AttributeService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Get attribute ID from the route parameters
    this.attributeId = this.route.snapshot.paramMap.get('id');
    
    // Fetch the attribute details if the ID is available
    if (this.attributeId) {
      const accessToken = localStorage.getItem('loggedInUserToken');
      this.loadAttribute(this.attributeId, accessToken!);
    }
  }

  // Fetch the attribute details by ID
  loadAttribute(attributeId: string, accessToken: string): void {
    this.attributeService.getAttributeById(attributeId, accessToken).subscribe(
      (data) => {
        this.attribute = data.data; // Assign the data to the attribute
      },
      (error) => {
        console.error('Error fetching attribute', error);
      }
    );
  }

  // Save attribute logic (including updated attribute values)
  saveAttribute(): void {
    console.log('Save attribute:', this.attribute);
    // Add the logic to save the updated attribute and its values via the service
  }

  // Method to show the dialog
  showDialog() {
    this.displayDialog = true;
  }
  displayDialog: boolean = false; // Control the visibility of the dialog
  newValueName: string = ''; 
  // Method to add the new value
  addAttributeValue() {
    if (this.newValueName) {
      this.attribute.attribute_values.push({
        id: this.attribute.attribute_values.length + 1, // Or use a unique ID if available
        name: this.newValueName,
        attribute_id: this.attribute.id, // Adjust as necessary
      });
      this.newValueName = ''; // Reset the input
      this.displayDialog = false; // Close the dialog
    }
  }

  // Method to remove an attribute value
  removeAttributeValue(id: number) {
    this.attribute.attribute_values = this.attribute.attribute_values.filter((value: { id: number; }) => value.id !== id);
  }

  
}
