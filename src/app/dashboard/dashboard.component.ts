import { Component, OnInit } from '@angular/core';
import { AnnonceService } from '../annonce.service';
import { UserService } from '../user.service';
import { CategoryService } from '../category.service';
import { Category1Service } from '../category1.service';
import { forkJoin } from 'rxjs';
import { ChartData, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  totalAds: number = 0;
  ads: any[] = [];
  totalUsers: number = 0;
  users: any[] = [];
  totalClients: number = 0;
  clients: any[] = [];
  totalCategorys: number = 0;
  categorys: any[] = [];
  adsByCategory: { [key: number]: number } = {}; // Object to store ads count by category

  // Properties for line chart
  data!: ChartData<'line'>;
  options!: ChartOptions<'line'>;

  // Properties for bar chart
  topCategoriesData!: ChartData<'bar'>;
  topCategoriesOptions!: ChartOptions<'bar'>;

  recentAnnouncements: any[] = []; // Array to hold recent announcements
  recentClients: any[] = []; // Array to hold recent clients
  topJobAds: any[] = []; // Top 5 job ads
  jobApplications: { [adId: number]: number } = {}; 
  categories: any[] = []; 

  constructor(
    private adsService: AnnonceService,
    private userService: UserService,
    private categoryService: CategoryService,
    private category1Service: Category1Service
  ) {}

  ngOnInit(): void {
    this.loadAds();
    this.getTotalUsers();
    this.getCategories();
    this.getTotalClients();
    this.getRecentAnnouncements(); // Fetch recent announcements
    this.getAdsData();
    this.loadCategoriesAndAds();
  }


  loadCategoriesAndAds(): void {
    const accessToken = localStorage.getItem('loggedInUserToken');
    
    // Fetch all categories
    this.categoryService.getCategoriesFrom(accessToken!).subscribe(
      categoryResponse => {
        this.categories = categoryResponse.data;

        // Find category IDs with parent_id = 140
        const childCategoryIds = this.categories
          .filter(category => category.parent_id === 140)
          .map(category => category.id);

        // Fetch ads belonging to these child categories
        this.adsService.getAllAdsValidator("all").subscribe(
          adsResponse => {
            // Filter ads based on child category IDs
            const filteredAds = adsResponse.filter(ad => childCategoryIds.includes(ad.category_id));
            
            // Sort ads and get top 5
            this.topJobAds = filteredAds.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 5);

            // Fetch applications for each job ad
            this.fetchApplicationsForTopAds();
          },
          error => {
            console.error('Error fetching ads data', error);
          }
        );
      },
      error => {
        console.error('Error fetching categories', error);
      }
    );
  }

  fetchApplicationsForTopAds(): void {
    const accessToken = localStorage.getItem('loggedInUserToken');
    const applicationRequests = this.topJobAds.map(ad =>
      this.adsService.getJobAppliances(ad.id, accessToken!)
    );

    forkJoin(applicationRequests).subscribe(
      responses => {
        responses.forEach((applications: any[], index: number) => {
          this.jobApplications[this.topJobAds[index].id] = applications.length;
        });

        // Log the result for debugging
        console.log('Job Applications Count:', this.jobApplications);
      },
      error => {
        console.error('Error fetching job applications', error);
      }
    );
  }

  
  getAdsData(): void {
    const statuses = ['approved', 'rejected', 'pending'];
    const requests = statuses.map(status => this.adsService.getAllAdsValidator(status));

    forkJoin(requests).subscribe(
      ([approvedAds, rejectedAds, pendingAds]) => {
        this.processData(approvedAds, rejectedAds, pendingAds);
      },
      error => {
        console.error('Error fetching ads data', error);
      }
    );
  }

  processData(approvedAds: any[], rejectedAds: any[], pendingAds: any[]): void {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const approvedCounts = this.countByMonth(approvedAds);
    const rejectedCounts = this.countByMonth(rejectedAds);
    const pendingCounts = this.countByMonth(pendingAds);

    this.data = {
      labels: months,
      datasets: [
        {
          label: 'Approved Ads',
          data: approvedCounts,
          fill: false,
          tension: 0.4,
          borderColor: '#42A5F5'
        },
        {
          label: 'Rejected Ads',
          data: rejectedCounts,
          fill: false,
          borderDash: [5, 5],
          tension: 0.4,
          borderColor: '#66BB6A'
        },
        {
          label: 'Pending Ads',
          data: pendingCounts,
          fill: true,
          borderColor: '#FFA726',
          tension: 0.4,
          backgroundColor: 'rgba(255,167,38,0.2)'
        }
      ]
    };

    this.options = {
      maintainAspectRatio: false,
      aspectRatio: 0.6,
      plugins: {
        legend: {
          labels: {
            color: '#333'
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: '#666'
          },
          grid: {
            color: '#eee'
          }
        },
        y: {
          ticks: {
            color: '#666'
          },
          grid: {
            color: '#eee'
          }
        }
      }
    };
  }

  countByMonth(ads: any[]): number[] {
    const counts = new Array(12).fill(0); // Array of 12 months, initialized to 0

    ads.forEach(ad => {
      const month = new Date(ad.created_at).getMonth(); // Get month (0-based index)
      counts[month]++;
    });

    return counts;
  }

  loadAds(): void {
    this.adsService.getAllAds().subscribe(
      (response) => {
        this.totalAds = response.length;
        this.ads = response;
        this.updateAdsByCategory();
      },
      (error) => {
        console.error('Error fetching ads:', error);
      }
    );
  }

  updateAdsByCategory(): void {
    const categoryRequests = this.categorys.map(category => this.category1Service.getAllAdsByCategorys(category.id));
    
    forkJoin(categoryRequests).subscribe(
      (responses) => {
        this.adsByCategory = {}; // Reset the adsByCategory object
        responses.forEach((adsInCategory: any[], index: number) => {
          this.adsByCategory[this.categorys[index].id] = adsInCategory.length;
        });

        // Prepare data for top categories chart
        this.prepareTopCategoriesData();
      },
      (error) => {
        console.error('Error fetching ads by category:', error);
      }
    );
  }

  prepareTopCategoriesData(): void {
    // Sort categories by number of ads in descending order
    const sortedCategories = Object.entries(this.adsByCategory)
      .sort(([, a], [, b]) => b - a) // Sort descending
      .slice(0, 5); // Get top 5 categories

    const labels = sortedCategories.map(([id]) => {
      const category = this.categorys.find(cat => cat.id === Number(id));
      return category ? category.name : 'Unknown';
    });

    const data = sortedCategories.map(([, count]) => count);

    this.topCategoriesData = {
      labels: labels,
      datasets: [
        {
          label: 'Number of Ads',
          data: data,
          backgroundColor: '#42A5F5',
          borderColor: '#1E88E5',
          borderWidth: 1
        }
      ]
    };

    this.topCategoriesOptions = {
      maintainAspectRatio: false,
      aspectRatio: 0.6,
      plugins: {
        legend: {
          labels: {
            color: '#333'
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: '#666'
          },
          grid: {
            color: '#eee'
          }
        },
        y: {
          ticks: {
            color: '#666'
          },
          grid: {
            color: '#eee'
          }
        }
      }
    };
  }

  getTotalClients(): void {
    const accessToken = localStorage.getItem('loggedInUserToken');
    this.userService.getAllUsers(0, accessToken!, 4).subscribe(
      (response) => {
        this.totalClients = response.length;
        this.processClients(response);
      },
      (error) => {
        console.error('Erreur lors de la récupération des clients:', error);
      }
    );
  }

  processClients(clients: any[]): void {
    // Sort clients by 'created_at' date in descending order
    const sortedClients = clients.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    // Get the top 4 most recent clients
    this.recentClients = sortedClients.slice(0, 4);
  }

  getTotalUsers(): void {
    const accessToken = localStorage.getItem('loggedInUserToken');

    this.userService.getAllUsers(0, accessToken!, 4).subscribe(
      (response) => {
        this.totalUsers = response.length;
        this.users = response;
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }

  getCategories(): void {
    const accessToken = localStorage.getItem('loggedInUserToken');
    this.categoryService.getCategoriesFrom(accessToken!).subscribe(
      (response) => {
        this.totalCategorys = response.data.length;
        this.categorys = response.data;
        this.updateAdsByCategory(); // Update ads count by category after loading categories
        console.log('Total categories:', this.totalCategorys);
        console.log('Categories:', this.categorys);
      },
      (error) => {
        console.error('Error fetching categories:', error);
      }
    );
  }

  getRecentAnnouncements(): void {
    this.adsService.getAllAds().subscribe(
      (response) => {
        this.processRecentAnnouncements(response); // Process recent announcements
      },
      (error) => {
        console.error('Error fetching recent announcements:', error);
      }
    );
  }

  processRecentAnnouncements(announcements: any[]): void {
    // Sort announcements by 'created_at' date in descending order
    const sortedAnnouncements = announcements.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    
    // Get the top 5 most recent announcements
    this.recentAnnouncements = sortedAnnouncements.slice(0, 7);
  }
}
