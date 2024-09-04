import { Component } from '@angular/core';
import { UserService } from '../user.service';

@Component({
  selector: 'app-list-clients-deleted',
  templateUrl: './list-clients-deleted.component.html',
  styleUrl: './list-clients-deleted.component.css'
})
export class ListClientsDeletedComponent {
  users: any[] = [];
  pagedCategories: any[] = [];
  searchTerm: string = '';
  itemsPerPage: number = 8;
  currentPage: number = 1;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    const accessToken = localStorage.getItem('loggedInUserToken');
    if (accessToken) {
      this.fetchUsers(accessToken);
    } else {
      console.error('Access token not found in localStorage');
    }
  }

  fetchUsers(accessToken: string): void {
    this.userService.getUsers(1, accessToken, 4).subscribe(
      data => {
        this.users = data.data;
        this.setPagedCategories();
      },
      error => {
        console.error('Error fetching users', error);
      }
    );
  }

  setCurrentPage(page: number): void {
    this.currentPage = page;
    this.setPagedCategories();
  }

  get pages(): number[] {
    const pageCount = Math.ceil(this.filteredUsers.length / this.itemsPerPage);
    return Array.from({ length: pageCount }, (_, i) => i + 1);
  }

  setPagedCategories(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.pagedCategories = this.filteredUsers.slice(startIndex, endIndex);
  }

  get filteredUsers(): any[] {
    if (!this.searchTerm) {
      return this.users;
    }
    return this.users.filter(user => 
      user.full_name.toLowerCase().includes(this.searchTerm.toLowerCase()) || 
      user.email.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  getInitials(firstName: string, lastName: string): string {
    return `${firstName.charAt(0).toUpperCase()}${lastName.charAt(0).toUpperCase()}`;
  }
}
