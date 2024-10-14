import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AddCategoryComponent } from './add-category/add-category.component';
import { ListCategoryComponent } from './list-category/list-category.component';
import { AddPhotoWebsiteComponent } from './add-photo-website/add-photo-website.component';
import { ListPhotoWebsiteComponent } from './list-photo-website/list-photo-website.component';
import { LoginComponent } from './login/login.component';
import { ListUserComponent } from './list-user/list-user.component';
import { DetailUserComponent } from './detail-user/detail-user.component';
import { DetailAdComponent } from './detail-ad/detail-ad.component';
import { ListAdsComponent } from './list-ads/list-ads.component';
import { ListUsersDeletedComponent } from './list-users-deleted/list-users-deleted.component';
import { AnnoncesEnAttenteComponent } from './annonces-en-attente/annonces-en-attente.component';
import { AnnoncesApprouveesComponent } from './annonces-approuvees/annonces-approuvees.component';
import { AnnoncesRejeteesComponent } from './annonces-rejetees/annonces-rejetees.component';
import { ListClientsComponent } from './list-clients/list-clients.component';
import { ListClientsDeletedComponent } from './list-clients-deleted/list-clients-deleted.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { ListPagesComponent } from './list-pages/list-pages.component';
import { PagesComponent } from './pages/pages.component';
import { AdsByCategoryComponent } from './ads-by-category/ads-by-category.component';
import { JobsComponent } from './jobs/jobs.component';
import { PreselectionCvsComponent } from './preselection-cvs/preselection-cvs.component';
import { GestionRolesComponent } from './gestion-roles/gestion-roles.component';
import { EditGestionRolesComponent } from './edit-gestion-roles/edit-gestion-roles.component';
import { TaxesComponent } from './taxes/taxes.component';
import { EditTaxesComponent } from './edit-taxes/edit-taxes.component';
import { ProduitsComponent } from './produits/produits.component';
import { AttributsComponent } from './attributs/attributs.component';
import { CaracteristiquesComponent } from './caracteristiques/caracteristiques.component';
import { MarquesComponent } from './marques/marques.component';
import { EditAttributsComponent } from './edit-attributs/edit-attributs.component';
import { EditCaracteristiquesComponent } from './edit-caracteristiques/edit-caracteristiques.component';
import { EditMarquesComponent } from './edit-marques/edit-marques.component';
import { CreateMarquesComponent } from './create-marques/create-marques.component';
import { CreateProduitsComponent } from './create-produits/create-produits.component';
import { EditProduitsComponent } from './edit-produits/edit-produits.component';

const routes: Routes = [
  { path: 'add_category', component: AddCategoryComponent },
  { path: 'categories', component: ListCategoryComponent },
  { path: 'page-ajouter-photo', component: AddPhotoWebsiteComponent },
  { path: 'page-photos-list', component: ListPhotoWebsiteComponent },
  { path: 'home', component: ListCategoryComponent },
  { path: '', component: LoginComponent },
  { path: 'utilisateurs-actifs', component: ListUserComponent },
  { path: 'produits', component: ProduitsComponent },
  { path: 'produits/add', component: CreateProduitsComponent },
  { path: 'produits/edit/:id', component: EditProduitsComponent },

  { path: 'attributs', component: AttributsComponent },
  { path: 'attributs/edit/:id', component: EditAttributsComponent },
  { path: 'caracteristiques', component: CaracteristiquesComponent },
  { path: 'caracteristiques/edit/:id', component: EditCaracteristiquesComponent },
  { path: 'marques', component: MarquesComponent },
  { path: 'marques/edit/:id', component: EditMarquesComponent },
  { path: 'marques/add', component: CreateMarquesComponent },

  { path: 'taxes', component: TaxesComponent },
  { path: 'taxes/edit/:id', component: EditTaxesComponent },
  { path: 'list-clients-actifs', component: ListClientsComponent },
  { path: 'list-clients-non-actifs', component: ListClientsDeletedComponent },
  { path: 'modifier-utilisateur/:id', component: EditUserComponent },
  { path: 'modifier-utilisateur/:id', component: EditUserComponent },
  { path: 'list-pages-fr', component: ListPagesComponent },
  { path: 'list-pages-ar', component: PagesComponent },
  { path: 'detail-utilisateur/:id', component: DetailUserComponent },
  { path: 'detail-annonce/:id', component: DetailAdComponent },
  { path: 'lists-annonces-by-category/:id', component: AdsByCategoryComponent },
  { path: 'lists-annonces-jobs', component: JobsComponent },
  { path: 'présélection-cvs/:id', component: PreselectionCvsComponent },
  { path: 'gestion-roles', component: GestionRolesComponent },
  { path: 'gestion-roles/edit/:id', component: EditGestionRolesComponent },
  { path: 'list-annonces/all', component: ListAdsComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'utilisateurs-non-actifs', component: ListUsersDeletedComponent },
  { path: 'list-annonces/attente', component: AnnoncesEnAttenteComponent },
  { path: 'list-annonces/approuve', component: AnnoncesApprouveesComponent },
  { path: 'list-annonces/rejete', component: AnnoncesRejeteesComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
