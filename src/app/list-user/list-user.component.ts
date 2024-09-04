import { Component } from '@angular/core';
import { UserService } from '../user.service';

@Component({
  selector: 'app-list-user',
  templateUrl: './list-user.component.html',
  styleUrl: './list-user.component.css'
})
export class ListUserComponent {
  users: any[] = [];
  pagedCategories: any[] = [];
  searchTerm: string = '';
  itemsPerPage: number = 8;
  currentPage: number = 1;

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
    // Check if localStorage is available (typically used in browser environments)
    if (typeof localStorage !== 'undefined') {
      const accessToken = localStorage.getItem('loggedInUserToken');
      if (accessToken) {
        
        const roleIds = [1, 2, 3]; // Role IDs from 1 to 3

        // Use a variable to store all user data
        let allUsers: string | any[] = [];

        // Use a loop to fetch users for each role ID
        for (const roleId of roleIds) {

          this.userService.getUsers(0, accessToken, roleId).subscribe(
            data => {
              console.log("update",roleId ,allUsers);

              // Merge the fetched users into allUsers
              allUsers = [...allUsers, ...data.data];

              this.users = allUsers;
              this.setPagedCategories();
                          
            },
            error => {
              console.error('Error fetching users', error);
            }
          );
        }
        
        
      } else {
        console.error('Access token not found in localStorage');
      }
    } else {
      console.error('localStorage is not available in this environment');
    }
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
