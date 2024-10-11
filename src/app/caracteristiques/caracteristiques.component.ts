import { Component } from '@angular/core';
import {  FeatureService } from '../feature.service';

@Component({
  selector: 'app-caracteristiques',
  templateUrl: './caracteristiques.component.html',
  styleUrl: './caracteristiques.component.css'
})
export class CaracteristiquesComponent {
  features : any[]=[];

  constructor(private featureService: FeatureService) {}

  ngOnInit(): void {
    const accessToken = localStorage.getItem('loggedInUserToken');
    this.loadRoles(accessToken!);
  }

  loadRoles(accessToken: string): void {
    this.featureService.getFeatures(accessToken).subscribe(
      (data) => {
        this.features = data.data; // Adaptez cette ligne selon la structure de votre réponse
        console.log("dattttaaaa roles", data.data);
      },
      (error) => {
        console.error('Erreur lors de la récupération des rôles:', error);
      }
    );
  }

  editRole(feature: any) {
    // Logique pour modifier le rôle
    console.log('Modifier le feature:', feature);
  }
  deleteRole(feature: any) {
    // Logique pour supprimer le rôle
    console.log('Supprimer le rôle:', feature);
  }
}
