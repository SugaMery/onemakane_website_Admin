import { Component } from '@angular/core';
import { UserService } from '../user.service';

@Component({
  selector: 'app-gestion-roles',
  templateUrl: './gestion-roles.component.html',
  styleUrl: './gestion-roles.component.css'
})
export class GestionRolesComponent {
  roles : any[]=[];

  constructor(private roleService: UserService) {}

  ngOnInit(): void {
    const accessToken = localStorage.getItem('loggedInUserToken');
    this.loadRoles(accessToken!);
  }

  loadRoles(accessToken: string): void {
    this.roleService.getRoles(accessToken).subscribe(
      (data) => {
        this.roles = data.data; // Adaptez cette ligne selon la structure de votre réponse
        console.log("dattttaaaa roles", data.data);
      },
      (error) => {
        console.error('Erreur lors de la récupération des rôles:', error);
      }
    );
  }

  editRole(role: any) {
    // Logique pour modifier le rôle
    console.log('Modifier le rôle:', role);
  }
  deleteRole(role: any) {
    // Logique pour supprimer le rôle
    console.log('Supprimer le rôle:', role);
  }

}
