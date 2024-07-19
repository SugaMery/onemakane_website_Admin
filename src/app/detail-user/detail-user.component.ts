import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../user.service';
import { AnnonceService } from '../annonce.service';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-detail-user',
  templateUrl: './detail-user.component.html',
  styleUrls: ['./detail-user.component.css']
})
export class DetailUserComponent implements OnInit {
  userData: any = {};
  adsCount: number = 0;
  ads: any;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private annonceService: AnnonceService,
    private confirmationService: ConfirmationService, private messageService: MessageService
  ) {}

  ngOnInit(): void {
    const adId = this.route.snapshot.paramMap.get('id');
  
    // Check if localStorage is available
    if (typeof localStorage !== 'undefined') {
      const accessToken = localStorage.getItem('loggedInUserToken');
  
      if (accessToken) {
        this.userService.getUserInfoById(Number(adId), accessToken).subscribe(
          data => {
            this.userData = data.data || {};
            this.getAds();
            // Call initMap once user data is loaded
            this.initMap();
          },
          error => {
            console.error('Error fetching user info', error);
          }
        );
      } else {
        console.error('Access token not found in localStorage');
      }
    } else {
      console.error('localStorage is not available in this environment');
    }
  }
  

  initMap(): void {
    // Check if google.maps is defined (Google Maps API loaded)
    if (typeof google === 'undefined' || typeof google.maps === 'undefined') {
      console.error('Google Maps API not loaded');
      return;
    }

    const geocoder = new google.maps.Geocoder();
    const mapElement = document.getElementById('map') as HTMLElement;

    if (!mapElement) {
      console.error('Élément de carte introuvable !');
      return;
    }

    // Style pour masquer les frontières
    const mapStyle: google.maps.MapTypeStyle[] = [
      {
        featureType: 'administrative',
        elementType: 'geometry',
        stylers: [{ visibility: 'off' }],
      },
      {
        featureType: 'administrative.country',
        elementType: 'labels',
        stylers: [{ visibility: 'off' }],
      },
    ];

    const map = new google.maps.Map(mapElement, {
      center: { lat: 31.1728205, lng: -7.3362482 }, // Centre sur le Maroc
      zoom: 5, // Adjusted zoom level to fit Morocco well within 150px height
      styles: mapStyle, // Appliquer le style pour masquer les frontières
    });

    // Utiliser des limites pour inclure tout le Maroc
    const moroccoBounds = {
      north: 35.92,
      south: 21.42,
      west: -17.13,
      east: -1.01,
    };
    map.fitBounds(moroccoBounds);

    // Remplacez par votre adDetail.postal_code
    const postalCode = this.userData.postal_code;

    // Géocodez le code postal
    geocoder.geocode(
      { address: postalCode + ', Morocco' },
      (results: any, status: string) => {
        if (status === 'OK' && results![0]) {
          const location = results![0].geometry.location;
          const bounds =
            results![0].geometry.bounds || results![0].geometry.viewport;

          // Crée et affiche le rectangle
          const rectangle = new google.maps.Rectangle({
            bounds: bounds,
            map: map,
            strokeColor: '#3BB77E',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#5ef29252', // Couleur de remplissage verte
            fillOpacity: 0.35,
          });

          // Centre la carte sur la localisation du code postal
          map.fitBounds(bounds);

          // Positionne l'icône personnalisée au centre du rectangle
          const center = bounds.getCenter();
          const icon = {
            url: '../../assets/imgs/icone.png', // Path to your custom icon
            scaledSize: new google.maps.Size(100, 100), // Adjust size if necessary
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(50, 50),
          };
          const marker = new google.maps.Marker({
            position: center,
            map: map,
            icon: icon,
            draggable: false,
            animation: google.maps.Animation.DROP,
          });
        } else {
          console.error(
            'Le géocodage a échoué pour la raison suivante : ' + status
          );
        }
      }
    );
  }

  getAds(): void {
    this.annonceService.getAds().subscribe(
      data => {
        this.adsCount = data.data.filter((ad: any) => ad.user_id === this.userData.id).length;
        this.ads = data.data.filter((ad: any) => ad.user_id === this.userData.id)
        console.log("data",data.data);
      },
      error => {
        console.error('Error fetching ads data', error);
      }
    );
  }

  confirm1(event: Event) {
    const adId = this.route.snapshot.paramMap.get('id');
    const accessToken = localStorage.getItem('loggedInUserToken');
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Êtes-vous sûr de vouloir supprimer cet utilisateur?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: 'pi pi-check',
      rejectIcon: 'pi pi-times',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => {
        // Logique de suppression de l'utilisateur
        this.userService.deleteUser(Number(adId),accessToken!).subscribe(
          (user) => {
            console.log("greeeet",user)

            this.messageService.add({
              severity: 'success',
              summary: 'Utilisateur supprimé',
              detail: 'L\'utilisateur a été supprimé avec succès.'
            });
            // Mettre à jour la liste des utilisateurs ou rediriger vers une autre page
          },
          error => {
            console.error('Erreur lors de la suppression de l\'utilisateur', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Erreur de suppression',
              detail: 'Une erreur s\'est produite lors de la suppression de l\'utilisateur.'
            });
          }
        );
      },
      reject: () => {
        this.messageService.add({
          severity: 'warn',
          summary: 'Action annulée',
          detail: 'Vous avez annulé la suppression de l\'utilisateur.'
        });
      }
    });
  }
  
  
}
