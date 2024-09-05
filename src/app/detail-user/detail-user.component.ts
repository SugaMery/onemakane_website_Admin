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
  ads: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalAds: number = 0;
  pages: number[] = [];
  visiblePages: number[] = [];
  isLastPageVisible: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private annonceService: AnnonceService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    const adId = this.route.snapshot.paramMap.get('id');
  
    if (typeof localStorage !== 'undefined') {
      const accessToken = localStorage.getItem('loggedInUserToken');
  
      if (accessToken) {
        this.userService.getUserInfoById(Number(adId), accessToken).subscribe(
          data => {
            this.userData = data.data || {};
            this.getAds();
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

  getAds(): void {
    this.annonceService.getAllAds().subscribe(
      data => {
        this.totalAds = data.filter((ad: any) => ad.user_id === this.userData.id).length;
        this.ads = data.filter((ad: any) => ad.user_id === this.userData.id);
        this.updatePagination();
      },
      error => {
        console.error('Error fetching ads data', error);
      }
    );
  }

  updatePagination(): void {
    this.pages = Array(Math.ceil(this.totalAds / this.itemsPerPage)).fill(0).map((_, i) => i + 1);
    this.visiblePages = this.pages.slice(Math.max(this.currentPage - 3, 0), Math.min(this.currentPage + 2, this.pages.length));
    this.isLastPageVisible = this.currentPage < this.pages.length;
  }

  setCurrentPage(page: number): void {
    if (page < 1 || page > this.pages.length) return;
    this.currentPage = page;
    this.updatePagination();
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
  confirmDeactivation(): void {
    this.confirmationService.confirm({
      message: 'Êtes-vous sûr de vouloir supprimer cette compte ? Cette action désactivera toutes les annonces.',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Oui',
      rejectLabel: 'Non',
      accept: () => this.deactivateAccount(),
      reject: () => this.messageService.add({severity: 'info', summary: 'Annulé', detail: 'L\'action a été annulée.'})
    });
  }

  deactivateAccount(): void {
    // Call your service to deactivate the account
    const userId = this.route.snapshot.paramMap.get('id');
    const accessToken = localStorage.getItem('loggedInUserToken');
            // Logique de suppression de l'utilisateur
            this.userService.deleteUser(Number(userId),accessToken!).subscribe(
              (user) => {
                console.log("greeeet",user)
    
                this.messageService.add({
                  severity: 'success',
                  summary: 'Utilisateur supprimé',
                  detail: 'L\'utilisateur a été supprimé avec succès.'
                });
                // Mettre à jour la liste des utilisateurs ou rediriger vers une autre page
                        // Actualiser la page après un court délai pour que l'utilisateur voie le message
        setTimeout(() => {
          window.location.reload();
        }, 1500); // Délai de 1,5 secondes avant de rafraîchir

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
  }

  confirmActivation(): void {
    this.confirmationService.confirm({
      message: 'Êtes-vous sûr de vouloir activer ce compte ? Cette action réactivera toutes les annonces.',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Oui',
      rejectLabel: 'Non',
      accept: () => this.activationAccount(),
      reject: () => this.messageService.add({severity: 'info', summary: 'Annulé', detail: 'L\'action a été annulée.'})
    });
  }
  

  activationAccount(): void {
    const userId = this.route.snapshot.paramMap.get('id');
    const accessToken = localStorage.getItem('loggedInUserToken');
    
    // Logique d'activation de l'utilisateur
    this.userService.updateUser(userId!, accessToken!, {'uuid':this.userData.uuid,'deleted_at': null}).subscribe(
      (user) => {
        console.log("Compte activé", user);
        
        this.messageService.add({
          severity: 'success',
          summary: 'Compte activé',
          detail: 'Le compte a été activé avec succès.'
        });
  
        // Actualiser la page après un court délai pour que l'utilisateur voie le message
        setTimeout(() => {
          window.location.reload();
        }, 1500); // Délai de 1,5 secondes avant de rafraîchir
      },
      error => {
        console.error('Erreur lors de l\'activation du compte', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur d\'activation',
          detail: 'Une erreur s\'est produite lors de l\'activation du compte.'
        });
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
