import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { MenuComponent } from './menu/menu.component';
import { ContentHeaderComponent } from './content-header/content-header.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { AddCategoryComponent } from './add-category/add-category.component';
import { ListCategoryComponent } from './list-category/list-category.component';
import { DatePipe } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { RadioButtonModule } from 'primeng/radiobutton'; 
import { CalendarModule } from 'primeng/calendar';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { AddPhotoWebsiteComponent } from './add-photo-website/add-photo-website.component';
import { ListPhotoWebsiteComponent } from './list-photo-website/list-photo-website.component';
import { LoginComponent } from './login/login.component';
import { ListUserComponent } from './list-user/list-user.component';
import { DetailUserComponent } from './detail-user/detail-user.component';
import { DetailAdComponent } from './detail-ad/detail-ad.component';
import { ImageModule } from 'primeng/image';
import { ListAdsComponent } from './list-ads/list-ads.component';
import { PreloaderComponent } from './preloader/preloader.component';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { ListUsersDeletedComponent } from './list-users-deleted/list-users-deleted.component';
import { AnnoncesEnAttenteComponent } from './annonces-en-attente/annonces-en-attente.component';
import { AnnoncesApprouveesComponent } from './annonces-approuvees/annonces-approuvees.component';
import { AnnoncesRejeteesComponent } from './annonces-rejetees/annonces-rejetees.component';
import { ListClientsComponent } from './list-clients/list-clients.component';
import { ListClientsDeletedComponent } from './list-clients-deleted/list-clients-deleted.component';
import { PagesComponent } from './pages/pages.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { ListPagesComponent } from './list-pages/list-pages.component';
import { AdsByCategoryComponent } from './ads-by-category/ads-by-category.component';
import { JobsComponent } from './jobs/jobs.component';
import { PreselectionCvsComponent } from './preselection-cvs/preselection-cvs.component';

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    HeaderComponent,
    MenuComponent,
    ContentHeaderComponent,
    DashboardComponent,
    AddCategoryComponent,
    ListCategoryComponent,
    AddPhotoWebsiteComponent,
    ListPhotoWebsiteComponent,
    LoginComponent,
    ListUserComponent,
    DetailUserComponent,
    DetailAdComponent,
    ListAdsComponent,
    PreloaderComponent,
    ListUsersDeletedComponent,
    AnnoncesEnAttenteComponent,
    AnnoncesApprouveesComponent,
    AnnoncesRejeteesComponent,
    ListClientsComponent,
    ListClientsDeletedComponent,
    PagesComponent,
    EditUserComponent,
    ListPagesComponent,
    AdsByCategoryComponent,
    JobsComponent,
    PreselectionCvsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    InputTextModule,
    DropdownModule,
    BrowserAnimationsModule,
    TagModule,
    DialogModule,
    ButtonModule,
    RadioButtonModule,
    CalendarModule,
    AvatarModule,
    AvatarGroupModule,
    ConfirmDialogModule,
    ToastModule ,
    ImageModule,
    MessagesModule,
    MessageModule
  ],
  providers: [
    provideClientHydration(),
    DatePipe,
    ConfirmationService, 
    MessageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
