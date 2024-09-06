import { Component } from '@angular/core';
import { UserService } from '../user.service';

@Component({
  selector: 'app-list-user',
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.css']
})
export class ListUserComponent {
  users: any[] = [];
  pagedCategories: any[] = [];
  searchTerm: string = '';
  itemsPerPage: number = 8;
  currentPage: number = 1;
  visiblePages: number[] = [];
  isLastPageVisible: boolean = false;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    const accessToken = localStorage.getItem('loggedInUserToken');
    if (accessToken) {
      this.fetchUsers();
    } else {
      console.error('Access token not found in localStorage');
    }
  }

  fetchUsers(): void {
    const accessToken = localStorage.getItem('loggedInUserToken');
    if (accessToken) {
      const roleIds = [1, 2, 3];
      let allUsers: any[] = [];

      for (const roleId of roleIds) {
        this.userService.getAllUsers(0, accessToken, roleId).subscribe(
          data => {
            allUsers = [...allUsers, ...data];
            this.users = allUsers;
            this.setPagedCategories();
            this.updateVisiblePages();
          },
          error => {
            console.error('Error fetching users', error);
          }
        );
      }
    } else {
      console.error('Access token not found in localStorage');
    }
  }

  setCurrentPage(page: number): void {
    if (page < 1 || page > this.pages.length) return;
    this.currentPage = page;
    this.setPagedCategories();
    this.updateVisiblePages();
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

  updateVisiblePages(): void {
    const totalPages = this.pages.length;
    const maxVisiblePages = 5;
    const halfVisible = Math.floor(maxVisiblePages / 2);

    if (totalPages <= maxVisiblePages) {
      this.visiblePages = this.pages;
    } else {
      if (this.currentPage <= halfVisible) {
        this.visiblePages = this.pages.slice(0, maxVisiblePages);
      } else if (this.currentPage + halfVisible >= totalPages) {
        this.visiblePages = this.pages.slice(totalPages - maxVisiblePages, totalPages);
      } else {
        this.visiblePages = this.pages.slice(this.currentPage - halfVisible - 1, this.currentPage + halfVisible);
      }
    }

    this.isLastPageVisible = this.visiblePages.includes(totalPages);
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
}
