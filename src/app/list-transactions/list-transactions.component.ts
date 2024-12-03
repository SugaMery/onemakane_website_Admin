import { Component } from '@angular/core';
import { OrdersService } from '../orders.service';
import { UserService } from '../user.service';
import { AnnonceService } from '../annonce.service';

@Component({
  selector: 'app-list-transactions',
  templateUrl: './list-transactions.component.html',
  styleUrl: './list-transactions.component.css'
})
export class ListTransactionsComponent {
  orders : any[]=[];
  payments : any[]=[];
  ad : any ;
  constructor(private ordersService: OrdersService,private userService : UserService,private annonceService : AnnonceService) {}

  ngOnInit(): void {
    const accessToken = localStorage.getItem('loggedInUserToken');
    this.loadRoles(accessToken!);
    console.log("dattttaaaa roles", this.payments);

  }
  selectedTransaction : any;
  selectTransaction(transaction: any): void {
    const accessToken = localStorage.getItem('loggedInUserToken');
this.selectedTransaction = transaction;
    // Optionally, fetch more details about the contact if needed
    // this.messagesService.getContactsById(contact.id, 'your_access_token').subscribe((contactDetails) => {
    //   this.selectedContact = contactDetails;
    // });
    console.log("Selected Transaction: ", this.selectedTransaction);

  }
  loadRoles(accessToken: string): void {
    this.ordersService.getOrders(accessToken).subscribe(
      (data) => {
        this.orders = data.data; // Adaptez cette ligne selon la structure de votre réponse
        this.orders.forEach((order)=>{
          order.payments.forEach((payment:any)=>{
            this.payments.push(payment)

          })
        })

      },
      (error) => {
        console.error('Erreur lors de la récupération des rôles:', error);
      }
    );
  }

  editRole(role: any) {
    // Logique pour modifier le rôle
    console.log('Modifier le rôle:', role);
  }
  deleteRole(role: any) {
    // Logique pour supprimer le rôle
    console.log('Supprimer le rôle:', role);
  }
  getStatusLabel(status: string): string {
    switch (status) {
      case 'success':
        return 'Réussi';
      case 'new':
        return 'Nouveau';
      case 'pending':
        return 'En attente';
      case 'rejected':
        return 'Rejeté';
      default:
        return 'Inconnu';
    }
  }

}
