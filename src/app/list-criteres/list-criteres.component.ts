import { Component } from '@angular/core';
import { CriteresService } from '../criteres.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-list-criteres',
  templateUrl: './list-criteres.component.html',
  styleUrls: ['./list-criteres.component.css']
})
export class ListCriteresComponent {
  
  criteres: any[] = [];
  filteredCriteres: any[] = [];
  paginatedCriteres: any[] = [];
  selectedCritere: any | null = null;
  searchTerm: string = '';
  currentPage: number = 1;
  totalPages: number = 1;
  itemsPerPage: number = 10;
  visiblePages: number[] = [];
  isLastPageVisible: boolean = false;

  constructor(private criteresService: CriteresService,private toastService: MessageService) {}
  getContent(critere: any): string {
    return typeof critere.content === 'object' ? JSON.stringify(critere.content) : critere.content;
  }
  
  ngOnInit(): void {
    this.loadCriteres();
  }

  loadCriteres(): void {
    this.criteresService.getSettings().subscribe((data: any) => {
      this.criteres = data.data;
      this.filteredCriteres = [...this.criteres];
      this.totalPages = Math.ceil(this.filteredCriteres.length / this.itemsPerPage);
      this.setCurrentPage(1);
    });
  }

  saveCritere(): void {
    const accessToken = localStorage.getItem('loggedInUserToken');
    console.log("datassss tttt",this.selectedCritere);

    if (this.selectedCritere.id) {
      this.criteresService.updateCritere(this.selectedCritere,accessToken!,1).subscribe((data) => {
        this.loadCriteres();
        this.clearSelection();
        //this.toastService.success('Critère mis à jour avec succès', 'Succès'); // Success toast
        console.log("datassss tttt",data,this.selectedCritere);

        this.showToast('Succès', 'Critère mis à jour avec succès', 'success');

      });
    } else {
      this.criteresService.createCritere(this.selectedCritere).subscribe((data) => {

        console.log("datassss",data,this.selectedCritere);
        this.loadCriteres();
        this.clearSelection();
        //this.toastService.success('Critère créé avec succès', 'Succès'); // Success toast
        this.showToast('Succès', 'Critère créé avec succès', 'success');

      });
    }
  }
  showToast(summary: string, detail: string, severity: string) {
    this.toastService.add({ severity: severity, summary: summary, detail: detail });
  }
  setCurrentPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedCriteres = this.filteredCriteres.slice(startIndex, endIndex);
    
    // Update the visible pages
    this.visiblePages = this.getVisiblePages(this.currentPage);
  }

  getVisiblePages(currentPage: number): number[] {
    const pages = [];
    const totalPages = this.totalPages;

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
      } else if (currentPage >= totalPages - 2) {
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2);
      }
    }

    return pages;
  }

  onSearch(): void {
    this.filteredCriteres = this.criteres.filter((critere) =>
      critere.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.totalPages = Math.ceil(this.filteredCriteres.length / this.itemsPerPage);
    this.setCurrentPage(1);
  }

  selectCritere(critere: any): void {
    this.getContent(critere);
    this.selectedCritere = { ...critere };
    this.selectedCritere.content= this.getContent(critere);
  }

  processContent(content: any): string {
    if (typeof content === 'object') {
      return content.text || ''; // return specific property or empty string
    }
    return content || ''; // if it's already a string, return as is
  }

  
  clearSelection(): void {
    this.selectedCritere = null;
  }



  deleteCritere(id: number): void {
    this.criteresService.deleteCritere(id).subscribe(() => this.loadCriteres());
  }

  addNewCritere(): void {
    this.selectedCritere = {
      id: null,
      name: '',
      model: '',
      key: '',
      content: '',
      created_at: new Date(),
    };
  }
}
