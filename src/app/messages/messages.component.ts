import { Component } from '@angular/core';
import { MessagesService } from '../messages.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.css'
})
export class MessagesComponent {
  contacts: any[] = [];
  pagination: any;
  selectedContact: any = null;
  constructor(private contactService: MessagesService) {}

  ngOnInit(): void {
    this.fetchContacts();
  }

  fetchContacts(): void {
    const accessToken = localStorage.getItem('loggedInUserToken');

    this.contactService.getContacts(accessToken!).subscribe((response: { status: string; data: any[]; pagination: any; }) => {
      if (response.status === 'Success') {
        this.contacts = response.data;
        this.filteredContacts = response.data; // Initially, no filters are applied
        this.totalItems = response.data.length;
        this.paginate();
      }
    });
  }

  selectContact(contact: any): void {
    const accessToken = localStorage.getItem('loggedInUserToken');

    this.contactService.getContactsById(contact.id,accessToken!).subscribe((data)=>{
      this.selectedContact = data.data;

    })
    // Optionally, fetch more details about the contact if needed
    // this.messagesService.getContactsById(contact.id, 'your_access_token').subscribe((contactDetails) => {
    //   this.selectedContact = contactDetails;
    // });
  }
  filteredContacts: any[] = []; // Array to store filtered contacts
  paginatedContacts: any[] = [];
  pages: number[] = [];
  visiblePages: number[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 20;
  totalItems: number = 0;
  isLastPageVisible: boolean = false;
  searchTerm: string = '';
  // Apply search filter
  onSearch(): void {
    if (this.searchTerm.trim() === '') {
      this.filteredContacts = this.contacts; // No filter, show all contacts
    } else {
      this.filteredContacts = this.contacts.filter(contact =>
        contact.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        contact.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        contact.phone.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
    this.totalItems = this.filteredContacts.length;
    this.paginate();
  }

  // Pagination logic
  paginate(): void {
    const totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    this.pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    // Calculate the range of contacts to show based on current page
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = this.currentPage * this.itemsPerPage;
    this.paginatedContacts = this.filteredContacts.slice(start, end);

    // Determine the visible pages based on the current page
    this.visiblePages = this.pages.slice(
      Math.max(this.currentPage - 2, 0),
      Math.min(this.currentPage + 3, totalPages)
    );

    // Check if the last page should be visible
    this.isLastPageVisible = this.currentPage < totalPages - 2;
  }

  // Set current page and apply pagination
  setCurrentPage(page: number): void {
    if (page >= 1 && page <= this.pages.length) {
      this.currentPage = page;
      this.paginate();
    }
  }

  // For pagination control: Previous and Next buttons
  setCurrentPageWithOffset(offset: number): void {
    this.setCurrentPage(this.currentPage + offset);
  }
}
