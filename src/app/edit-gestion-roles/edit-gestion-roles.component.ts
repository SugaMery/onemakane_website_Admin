import { Component } from '@angular/core';
import { AnnonceService } from '../annonce.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../user.service';

@Component({
  selector: 'app-edit-gestion-roles',
  templateUrl: './edit-gestion-roles.component.html',
  styleUrl: './edit-gestion-roles.component.css'
})
export class EditGestionRolesComponent {
  roleId: number =0;
  roleData = {
    name: '',
    slug: '',
    level: 1,
    active: true,
    // Add other properties you want to edit
  };

  constructor(
    private route: ActivatedRoute,
    private roleService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.roleId = Number(this.route.snapshot.paramMap.get('id')) ;
    // Load the role data using a service method (not shown here)
    this.loadRoleData();
  }

  loadRoleData(): void {
    // Implement logic to fetch the current role data and populate roleData
    // This can be another service method that fetches the role by ID


  }

  updateRole(): void {
    const accessToken = localStorage.getItem('loggedInUserToken');
    this.roleService.updateRole(this.roleId!, this.roleData, accessToken!).subscribe(
      response => {
        console.log('Role updated successfully', response);
        this.router.navigate(['/gestion-roles']); // Redirect after update
      },
      error => {
        console.error('Error updating role', error);
      }
    );
  }
}
