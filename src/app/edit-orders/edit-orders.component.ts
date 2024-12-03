import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrdersService } from '../orders.service';
import { UserService } from '../user.service';
import { AnnonceService } from '../annonce.service';

@Component({
  selector: 'app-edit-orders',
  templateUrl: './edit-orders.component.html',
  styleUrl: './edit-orders.component.css'
})
export class EditOrdersComponent {
  orderDetails: any;
  orderStatus: string = '';
  orderId: any;

  constructor(private route: ActivatedRoute, private ordersService: OrdersService,private annonceService : AnnonceService) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.orderId = params['id'];  // Get the order ID from route parameters
      this.fetchOrderDetails();
    });
  }
user :any;
  fetchOrderDetails(): void {
    console.log('Order ID:', this.orderId);
    console.log('Order Details:', this.orderDetails);
    const accessToken = localStorage.getItem('loggedInUserToken');

    this.ordersService.getOrdersById(this.orderId, accessToken!).subscribe(response => {
      this.orderDetails = response.data;
      this.annonceService.getAdById(this.orderDetails.ad_id).subscribe(
          
        (datas)=>{
  this.user = datas.data
  console.log('Order user:', this.user);
  
        });
      console.log('Order ID2:', this.orderId);
      console.log('Order Details2:', this.orderDetails);
    });


  }

  saveNotes(): void {
    // Logic to save notes
    console.log(this.orderDetails?.notes);
  }
}
