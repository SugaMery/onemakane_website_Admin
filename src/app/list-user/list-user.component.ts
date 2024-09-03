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
  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.fetchUsers();

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
  
  itemsPerPage: number = 8; // Number of items per page
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
