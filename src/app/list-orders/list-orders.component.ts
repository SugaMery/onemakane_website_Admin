import { Component } from '@angular/core';
import { OrdersService } from '../orders.service';
import { UserService } from '../user.service';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs';

@Component({
  selector: 'app-list-orders',
  templateUrl: './list-orders.component.html',
  styleUrl: './list-orders.component.css'
})
export class ListOrdersComponent {
  orders : any[]=[];

  constructor(private ordersService: OrdersService,private userService : UserService) {}

  ngOnInit(): void {
    const accessToken = localStorage.getItem('loggedInUserToken');
    this.loadRoles(accessToken!);
  }

  loadRoles(accessToken: string): void {
    this.ordersService.getOrders(accessToken).subscribe(
      (data) => {
        this.orders = data.data; // Adaptez cette ligne selon la structure de votre réponse
        this.orders.forEach((order)=>{
          this.userService.getUserInfoById(Number(order.id), accessToken!).subscribe(
          
          (datas)=>{
            order.ad= datas.data
            console.log("dattttaaaa roles", data.data,this.orders);

          });
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
