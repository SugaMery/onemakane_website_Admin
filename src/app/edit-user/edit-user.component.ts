import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../user.service';
import { AnnonceService } from '../annonce.service';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.css'
})
export class EditUserComponent {
  userData: any = {};
    adsCount: number = 0;
  ads: any;
  currentSection: string = 'general';
  setSection(section: string): void {
    this.currentSection = section;
    // Optionally, load data specific to the section if needed
  }

  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalAds: number = 0;
  pages: number[] = [];
  visiblePages: number[] = [];
  isLastPageVisible: boolean = false;
  password: string = '';
  repartpassword: string = '';
  passwordMismatch: boolean = false;
  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private annonceService: AnnonceService,
    private confirmationService: ConfirmationService, private messageService: MessageService
  ) {}
  saveChanges() {
    const userId = this.route.snapshot.paramMap.get('id');
    const accessToken = localStorage.getItem('loggedInUserToken');
    console.log('Utilisateur response', this.userData);
const dataUser = {
  'first_name': this.userData.first_name,
  'last_name':  this.userData.last_name,
  'telephone':  this.userData.telephone,
  'email':  this.userData.email,
  'role_id':  this.userData.role_id,
  'civility':  this.userData.civility,
  'address':  this.userData.address,
  'city':  this.userData.city,
  'postal_code':  this.userData.postal_code,
  'uuid':  this.userData.uuid,

}
    this.userService.updateUser(userId!, accessToken!, dataUser).subscribe(
      response => {
        this.messageService.add({severity: 'success', summary: 'Succès', detail: 'Les informations ont été mises à jour avec succès.'});
      
        // Gérer la réponse (afficher un message de succès, rediriger, etc.)
      },
      error => {
        this.messageService.add({severity: 'error', summary: 'Erreur', detail: 'Erreur lors de la mise à jour des informations.'});
        // Gérer l'erreur (afficher un message d'erreur, etc.)
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
                        this.userService.getUserAllAdsById(Number(userId), accessToken!,"all").subscribe((data: any[]) => {
                          console.log("Annonces récupérées:", data);
                        
                          // Parcourir chaque annonce et mettre à jour son statut
                          data.forEach((ad) => {
                            this.annonceService.updateAnnonce(ad.id, ad.uuid, { 'validation_status': 'rejected' }, accessToken!)
                              .subscribe(
                                (response) => {
                                  console.log(`Annonce ${ad.id} mise à jour avec succès`, response);
                                },
                                (error) => {
                                  console.error(`Erreur lors de la mise à jour de l'annonce ${ad.id}`, error);
                                }
                              );
                          });
                        });
                        
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
        this.userService.getUserAllAdsById(Number(userId), accessToken!,"all").subscribe((data: any[]) => {
          console.log("Annonces récupérées:", data);
        
          // Parcourir chaque annonce et mettre à jour son statut
          data.forEach((ad) => {
            this.annonceService.updateAnnonce(ad.id, ad.uuid, { 'validation_status': 'approved' }, accessToken!)
              .subscribe(
                (response) => {
                  console.log(`Annonce ${ad.id} mise à jour avec succès`, response);
                },
                (error) => {
                  console.error(`Erreur lors de la mise à jour de l'annonce ${ad.id}`, error);
                }
              );
          });
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
  


  saveChangesPassword(): void {
    if (this.password !== this.repartpassword) {
      this.passwordMismatch = true;
      this.messageService.add({severity: 'error', summary: 'Erreur', detail: 'Les mots de passe ne correspondent pas.'});
      return;
    }

    if (this.password.length < 8) { // Example criteria
      this.messageService.add({severity: 'error', summary: 'Erreur', detail: 'Le mot de passe doit contenir au moins 8 caractères.'});
      return;
    }

    this.passwordMismatch = false;

    const userId = this.route.snapshot.paramMap.get('id');
    const accessToken = localStorage.getItem('loggedInUserToken');
    const dataUser = {
      'password': this.password,
      'uuid': this.userData.uuid,
    };

    this.userService.updateUser(userId!, accessToken!, dataUser).subscribe(
      response => {
        this.messageService.add({severity: 'success', summary: 'Succès', detail: 'Mot de passe modifié avec succès.'});
      },
      error => {
        this.messageService.add({severity: 'error', summary: 'Erreur', detail: 'Erreur lors de la modification du mot de passe.'});
      }
    );
  }
  ngOnInit(): void {
    const adId = this.route.snapshot.paramMap.get('id');
  
    // Check if localStorage is available
    if (typeof localStorage !== 'undefined') {
      const accessToken = localStorage.getItem('loggedInUserToken');
  
      if (accessToken) {
    
        this.userService.getUserInfoById(Number(adId), accessToken).subscribe(
          data => {
            this.userData = data.data || {};
            // Call initMap once user data is loaded
            console.log("userrrrdata",this.userData)
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
    const userId = this.route.snapshot.paramMap.get('id');
    const accessToken = localStorage.getItem('loggedInUserToken');

    this.annonceService.getAllAdsValidator("all").subscribe(
      data => {
        console.log("fiilllllllkkkkkkk",data)
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

}
