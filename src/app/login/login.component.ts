import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private userService: UserService) {}
  userData = {
    email: '',
    password: ''
  };
  showPassword = false;

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {

    console.log('dataaa',this.userData)
    this.userService.login(this.userData).subscribe(
      (response) => {
        // Store user ID and token in local storage
        console.log('dataaa',response)

        localStorage.removeItem('loggedInUserToken');
        localStorage.removeItem('loggedInUser');
  

        // Store user ID and token in local storage
        localStorage.setItem('loggedInUserId', response.data.id);
        localStorage.setItem('loggedInUserToken', response.data.token);
        // Redirect to the dashboard
        window.location.href = '/home';
      },
      (error) => {
        // Handle login error
        console.error(error);
      }
    );
  }
}
