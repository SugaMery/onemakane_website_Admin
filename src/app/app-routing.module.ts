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
import { EditGestionRolesComponent } from './edit-gestion-roles/edit-gestion-roles.component';
import { GestionRolesComponent } from './gestion-roles/gestion-roles.component';
import { ListUsersNotActivedComponent } from './list-users-not-actived/list-users-not-actived.component';
import { MessagesComponent } from './messages/messages.component';
import { BlogsComponent } from './blogs/blogs.component';
import { AddBlogsComponent } from './add-blogs/add-blogs.component';
import { EditBlogsComponent } from './edit-blogs/edit-blogs.component';
import { ListCriteresComponent } from './list-criteres/list-criteres.component';
import { ListOrdersComponent } from './list-orders/list-orders.component';
import { ListTransactionsComponent } from './list-transactions/list-transactions.component';
import { ListClientDeletedComponent } from './list-client-deleted/list-client-deleted.component';
import { EditOrdersComponent } from './edit-orders/edit-orders.component';

const routes: Routes = [
  { path: 'add_category', component: AddCategoryComponent },
  { path: 'list_category', component: ListCategoryComponent },
  { path: 'page-ajouter-photo', component: AddPhotoWebsiteComponent },
  { path: 'page-photos-list', component: ListPhotoWebsiteComponent },
  { path: 'home', component: ListCategoryComponent },
  { path: '', component: LoginComponent },
  { path: 'list-utilisateurs', component: ListUserComponent },
  { path: 'list-clients-actifs', component: ListClientsComponent },
  { path: 'list-clients-non-actifs', component: ListClientDeletedComponent },
  { path: 'modifier-utilisateur/:id', component: EditUserComponent },
  { path: 'modifier-utilisateur/:id', component: EditUserComponent },
  { path: 'list-pages-fr', component: ListPagesComponent },
  { path: 'list-pages-ar', component: PagesComponent },
  { path: 'detail-utilisateur/:id', component: DetailUserComponent },
  { path: 'detail-annonce/:id', component: DetailAdComponent },
  { path: 'lists-annonces-by-category/:id', component: AdsByCategoryComponent },
  { path: 'lists-annonces-jobs', component: JobsComponent },
  { path: 'présélection-cvs/:id', component: PreselectionCvsComponent },
  { path: 'messages', component: MessagesComponent },
  { path: 'list-blogs', component: BlogsComponent },
  { path: 'modifier-blog/:id', component: EditBlogsComponent },
  { path: 'ajouter-blog', component: AddBlogsComponent },


  { path: 'list-criteres', component: ListCriteresComponent },
  { path: 'list-orders', component: ListOrdersComponent },
  { path: 'list-transations', component: ListTransactionsComponent },
  { path: 'modifier-order/:id', component: EditOrdersComponent },


  { path: 'list-annonces/all', component: ListAdsComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'list-utilisateurs-non-actifs', component: ListUsersNotActivedComponent },
  { path: 'list-utilisateurs-desactive', component: ListUsersDeletedComponent },
  { path: 'list-clients-desactive', component: ListClientsDeletedComponent },

  { path: 'list-annonces/attente', component: AnnoncesEnAttenteComponent },
  { path: 'list-annonces/approuve', component: AnnoncesApprouveesComponent },
  { path: 'list-annonces/rejete', component: AnnoncesRejeteesComponent },
  { path: 'gestion-roles', component: GestionRolesComponent },
  { path: 'gestion-roles/edit/:id', component: EditGestionRolesComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
