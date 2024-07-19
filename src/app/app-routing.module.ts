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

const routes: Routes = [
  { path: 'add_category', component: AddCategoryComponent },
  { path: 'list_category', component: ListCategoryComponent },
  { path: 'page-ajouter-photo', component: AddPhotoWebsiteComponent },
  { path: 'page-photos-list', component: ListPhotoWebsiteComponent },
  { path: 'home', component: ListCategoryComponent },
  { path: '', component: LoginComponent },
  { path: 'list-utilisateurs', component: ListUserComponent },
  { path: 'detail-utilisateur/:id', component: DetailUserComponent },
  { path: 'detail-annonce/:id', component: DetailAdComponent },
  { path: 'list-annonces', component: ListAdsComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'list-utilisateurs-non-actifs', component: ListUsersDeletedComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
