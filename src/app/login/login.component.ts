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
  errorMessage: string = '';

  constructor(private userService: UserService) {}
  userData = {
    email: '',
    password: ''
  };
  showPassword = false;

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    this.userService.login(this.userData).subscribe(
      (response) => {
        // Vérifiez si role_id est inférieur ou égal à 2
        if (response.data.role_id <= 2) {
          // Stocker l'ID utilisateur et le token dans le local storage
          localStorage.removeItem('loggedInUserToken');
          localStorage.removeItem('loggedInUserId');
          localStorage.removeItem('loggedInRoleId');

          localStorage.setItem('loggedInUserId', response.data.id);
          localStorage.setItem('loggedInUserToken', response.data.token);
          localStorage.setItem('loggedInRoleId', response.data.role_id);

          // Redirection vers le tableau de bord
          window.location.href = '/home';
        } else {
          // Afficher le message d'erreur
          this.errorMessage = 'Vous n\'avez pas accès.';
        }
      },
      (error) => {
        // Gérer les erreurs de connexion
        console.error(error);
        if (error.error && error.error.message === 'failure_identity_not_found') {
          this.errorMessage = 'Mot de passe ou email incorrect.';
        } else {
          this.errorMessage = 'Une erreur s\'est produite lors de la connexion.';
        }
      }
    );
  }

}
