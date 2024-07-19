import { Component } from '@angular/core';
import { UserService } from '../user.service';

@Component({
  selector: 'app-list-users-deleted',
  templateUrl: './list-users-deleted.component.html',
  styleUrl: './list-users-deleted.component.css'
})
export class ListUsersDeletedComponent {

  users: any[] = [];
  pagedCategories: any[] = [];
  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.fetchUsers();

  }

  fetchUsers(): void {
    // Check if localStorage is available (typically used in browser environments)
    if (typeof localStorage !== 'undefined') {
      const accessToken = localStorage.getItem('loggedInUserToken');
      if (accessToken) {
        this.userService.getUsers(1,accessToken).subscribe(
          data => {
            this.users = data.data;
            this.setPagedCategories();
          },
          error => {
            console.error('Error fetching users', error);
          }
        );
      } else {
        console.error('Access token not found in localStorage');
      }
    } else {
      console.error('localStorage is not available in this environment');
    }
  }
  
  itemsPerPage: number = 7; // Number of items per page
  currentPage: number = 1; // Current page

  setCurrentPage(page: number) {
    this.currentPage = page;
    this.setPagedCategories();
  }
  get pages(): number[] {
    const pageCount = Math.ceil(
      this.users.length / this.itemsPerPage
    );
    return Array.from({ length: pageCount }, (_, i) => i + 1);
  }
  setPagedCategories() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.pagedCategories = this.users.slice(startIndex, endIndex);
    console.log("rrr",this.pagedCategories)
  }

  getInitials(firstName: string, lastName: string): string {
    const firstInitial = firstName.charAt(0).toUpperCase();
    const lastInitial = lastName.charAt(0).toUpperCase();
    return `${firstInitial}${lastInitial}`;
  }
}
