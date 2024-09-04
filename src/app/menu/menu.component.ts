import { Component } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {
  activeItem: string = ''; // To store the active menu item

  setActive(item: string) {
    this.activeItem = item;
  }

  isActive(item: string): boolean {
    return this.activeItem === item;
  }

  isAdmin: boolean = false;

  ngOnInit(): void {
    this.checkUserRole();
  }

  checkUserRole(): void {
    const roleId = localStorage.getItem('loggedInRoleId');
    if (roleId === '1') {  // Vérifier si le role_id est 1
      this.isAdmin = true;
    }
  }
}
