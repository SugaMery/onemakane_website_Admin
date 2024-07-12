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

const routes: Routes = [
  { path: 'add_category', component: AddCategoryComponent },
  { path: 'list_category', component: ListCategoryComponent },
  { path: 'page-ajouter-photo', component: AddPhotoWebsiteComponent },
  { path: 'page-photos-list', component: ListPhotoWebsiteComponent },
  { path: 'home', component: ListCategoryComponent },
  { path: '', component: LoginComponent },
  { path: 'list-utilisateur', component: ListUserComponent },
  { path: 'detail-utilisateur/:id', component: DetailUserComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
