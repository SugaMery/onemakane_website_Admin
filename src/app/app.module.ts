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
    DetailUserComponent
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
    ToastModule
  ],
  providers: [
    provideClientHydration(),
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
