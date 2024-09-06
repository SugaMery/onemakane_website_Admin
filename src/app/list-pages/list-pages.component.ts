import { Component, OnInit } from '@angular/core';
import { PageService } from '../page.service';
import { CategoryService } from '../category.service';

@Component({
  selector: 'app-list-pages',
  templateUrl: './list-pages.component.html',
  styleUrls: ['./list-pages.component.css']
})
export class ListPagesComponent implements OnInit {
  pageContent: string = '';
  titrePage: string = '';
  pages: any[] = [];  // Array to store multiple pages (id, title, langId)
  selectedPageIndex: number = 0;  // Track the active page in the sidebar
  categories: any[] = [];
  Souscategories: any[] = [];

  constructor(
    private pageService: PageService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    // Fetch categories if needed
    // this.fetchCategories();

    // Example list of pages to display in the sidebar
    this.pages = [
      { id: '1', langId: '1', title: 'A propos de nous' },
      { id: '2', langId: '1', title: 'Conditions Générales d\'Utilisation' },
      { id: '3', langId: '1', title: 'Mentions légales' }
    ];

    // Load the first page by default
    this.loadPage(this.pages[0].id, this.pages[0].langId, 0);
  }

  loadPage(pageId: string, langId: string, index: number): void {
    this.pageService.getPage(pageId, langId).subscribe(
      (data) => {
        this.pageContent = this.modifyHeaders(data.data.content);
        this.titrePage = data.data.title;
        this.selectedPageIndex = index;  // Update the selected index for highlighting
        console.log("selectedPageIndex",this.selectedPageIndex);
      },
      (error) => {
        console.error('Error fetching page data', error);
      }
    );
  }

  private modifyHeaders(content: string): string {
    // Replace <h1> with <div class="single-header style-2"><h1>
    content = content.replace(/<h1>/g, '<div class="single-header style-2"><h1>');
    content = content.replace(/<\/h1>/g, '</h1></div>');

    // Replace <h2> with <h3>
    content = content.replace(/<h2>/g, '<h3>');
    content = content.replace(/<\/h2>/g, '</h3>');

    return content;
  }

  updatePage(): void {
    const body = {
      title: this.titrePage,
      content: this.pageContent
    };
    console.log('Page updated response', body);
    const accessToken = localStorage.getItem('loggedInUserToken');

    this.pageService.updatePage(this.pages[this.selectedPageIndex].id, body,accessToken!).subscribe(
      (response) => {
        console.log('Page updated successfully', response);
        // Optionally handle success response
      },
      (error) => {
        console.error('Error updating page', error);
        // Optionally handle error response
      }
    );
  }}
