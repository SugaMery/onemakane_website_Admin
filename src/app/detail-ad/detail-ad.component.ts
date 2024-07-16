import { Component, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AnnonceService } from '../annonce.service';
import { DOCUMENT } from '@angular/common';
import { CategoryService } from '../category.service';
import { SettingService } from '../setting.service';
import { Category1Service } from '../category1.service';

@Component({
  selector: 'app-detail-ad',
  templateUrl: './detail-ad.component.html',
  styleUrl: './detail-ad.component.css'
})
export class DetailAdComponent {
  ad: any;
  adId: string = '';
  adDetail: any = [];

  constructor(
    private route: ActivatedRoute,
    private annonceService: AnnonceService,
    @Inject(DOCUMENT) private document: Document,
    private categoryService : Category1Service,
    private settingService : SettingService
  ) { }
  transformedField:
    | {
        type: any;
        value: string;
        label: any;
        setting: string;
      }[]
    | undefined;
  ngOnInit(): void {
    const adId = this.route.snapshot.paramMap.get('id');
    this.getAdDetails(adId!);

    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id !== null) {
        this.adId = id;

        if (
          this.document.defaultView &&
          this.document.defaultView.localStorage
        ) {
          const accessToken =
            this.document.defaultView.localStorage.getItem('loggedInUserToken');
          // Fetch ad details
          this.annonceService.getAdById(this.adId).subscribe((data) => {
            this.adDetail = data.data;
            console.log('modelfilds', data);

            this.categoryService
              .getCategoryById(data.data.category_id)
              .subscribe((category) => {
                const modelFields = category.data.model_fields;
                const queryParams = { model: category.data.model };
                console.log('modelfilds', modelFields);
                this.settingService
                  .getSettings(accessToken!, queryParams)
                  .subscribe(
                    (setting) => {
                      if (setting.data) {
                        // Transform modelFields into transformedFields with initial structure
                        const transformedFields = Object.keys(modelFields).map(
                          (key) => ({
                            value: key,
                            label: modelFields[key].label,
                            setting: key, // Initialize setting with key, you'll update this later
                            type: modelFields[key].type,
                            options: modelFields[key].options,
                            dependant: modelFields[key].dependant,
                          })
                        );
                        transformedFields.forEach((field) => {
                          // Check if options are defined and type is 'select'
                          // Check if options are defined and type is 'select'
                          if (modelFields[field.value].route) {
                            const fieldValue =
                              data.data.additional[field.value];
                            // Perform the service call with the appropriate route and accessToken
                            this.settingService
                              .createMarque(
                                modelFields[field.value].route,
                                accessToken!
                              )
                              .subscribe((response) => {
                                // Extract the relevant categories
                                const marquesPopulaires =
                                  response.data['Marques populaires'];
                                const autresMarques =
                                  response.data['Autres marques'];

                                // Convert objects to arrays
                                const marquesPopulairesArray = Object.entries(
                                  marquesPopulaires
                                ).map(([key, value]) => ({
                                  id: key,
                                  name: value,
                                }));
                                const autresMarquesArray = Object.entries(
                                  autresMarques
                                ).map(([key, value]) => ({
                                  id: key,
                                  name: value,
                                }));

                                // Combine arrays if needed
                                const allMarquesArray = [
                                  ...marquesPopulairesArray,
                                  ...autresMarquesArray,
                                ];

                                // Filter the array to find the item with the specified ID
                                const filteredResponse = allMarquesArray.filter(
                                  (item: { id: string }) =>
                                    item.id === String(fieldValue)
                                );

                                // Handle the filtered response
                                if (filteredResponse.length > 0) {
                                  field.setting =
                                    filteredResponse[0].name!.toString();
                                }
                              });
                          } else if (
                            !modelFields[field.value].options &&
                            modelFields[field.value].type === 'select' &&
                            !modelFields[field.value].dependant
                          ) {
                            // Apply the logic for 'get setting'
                            const matchedSetting = setting.data.find(
                              (settingItem: { name: string }) =>
                                settingItem.name === field.value
                            );

                            if (matchedSetting) {
                              if (
                                data.data.additional &&
                                data.data.additional[field.value]
                              ) {
                                field.setting =
                                  matchedSetting.content[
                                    data.data.additional[field.value]
                                  ];
                              } else {
                                console.error(
                                  `No additional data found for key '${field.value}'`
                                );
                              }
                            } else {
                              console.error(
                                `No setting found for key '${field.value}'`,
                                field,
                                modelFields
                              );
                            }
                          } else if (
                            modelFields[field.value].type === 'number' ||
                            modelFields[field.value].type === 'text' ||
                            modelFields[field.value].type === 'date' ||
                            modelFields[field.value].type === 'int'
                          ) {
                            field.setting = data.data.additional[field.value];
                          } else if (
                            modelFields[field.value].options &&
                            modelFields[field.value].type !== 'bool'
                          ) {
                            field.setting =
                              modelFields[field.value].options[
                                data.data.additional[field.value]
                              ];
                            console.error(
                              `No setting found for key '${field.value}'`,
                              field,
                              modelFields
                            );
                            // Apply the logic when options are not defined or type is not 'select'
                          } else if (
                            modelFields[field.value].type === 'multiple'
                          ) {
                            try {
                              field.setting = JSON.parse(
                                data.data.additional[field.value]
                              );
                            } catch (error) {
                              console.error('Error parsing JSON:', error);
                            }
                          } else if (
                            modelFields[field.value].type === 'bool' &&
                            modelFields[field.value].conditions
                          ) {
                            field.setting =
                              data.data.additional[field.value] === 1
                                ? 'Oui'
                                : 'Non';
                          } else if (modelFields[field.value].dependant) {
                            const model = modelFields[field.value].dependant;
                            console.log(
                              'depent',
                              modelFields[field.value],
                              data.data.additional[model],
                              modelFields[model],
                              transformedFields
                            );
                            const matchedSetting = setting.data.find(
                              (settingItem: { name: string }) =>
                                settingItem.name === field.value
                            );
                            console.log(
                              'matchi',
                              matchedSetting,
                              matchedSetting.content[
                                data.data.additional[model]
                              ]
                            );
                            if (matchedSetting) {
                              if (
                                data.data.additional &&
                                data.data.additional[field.value]
                              ) {
                                const test =
                                  matchedSetting.content[
                                    data.data.additional[model]
                                  ];
                                field.setting =
                                  test[data.data.additional[field.value]];
                                console.log('matchitttt', field.setting, test);
                              } else {
                                console.error(
                                  `No additional data found for key '${model}'`
                                );
                              }
                            } else {
                              console.error(
                                `No setting found for key '${field.value}'`,
                                field,
                                modelFields
                              );
                            }
                          }
                        });

                        this.transformedField = transformedFields.filter(
                          (fild) => fild.value !== 'need_cv'
                        );
                        this.ad.setting = transformedFields.filter(
                          (fild) => fild.setting
                        );;

                        console.log('gooooorrr',this.ad)
                      } else {
                        console.error('No data found in settings.');
                      }
                    },
                    (error) => {
                      console.error('Error fetching settings:', error);
                    }
                  );
              });

          });
        }
        // Utilisez maintenant this.adId pour obtenir l'ID de l'annonce
      }
    });
  }

  getAdDetails(id: string): void {
    this.annonceService.getAdById(id).subscribe((ad) => {this.ad = ad.data;
    console.log('rrrr',this.ad,ad)
    });
  }

  saveAsDraft() {
    // Logique pour sauvegarder en brouillon
    this.ad.validation_status = 'draft';
    const formData = {
      validation_status: 'draft'
    };
    const accessToken = localStorage.getItem('loggedInUserToken');
    this.annonceService.updateAnnonce(this.adId, this.adDetail.uuid, formData, accessToken!).subscribe((log) => {
      console.log('Draft saved', log);
    });
  }
  
  publish() {
    // Logique pour publier
    this.ad.validation_status = 'approved'; // Ou 'pending', selon votre logique
    const formData = {
      validation_status: 'approved' // Ou 'pending', selon votre logique
    };
    const accessToken = localStorage.getItem('loggedInUserToken');
    this.annonceService.updateAnnonce(this.adId, this.adDetail.uuid, formData, accessToken!).subscribe((log) => {
      console.log('Published', log);
    });
  }
  
  approve() {
    // Logique pour approuver
    this.ad.validation_status = 'approved';
    const formData = {
      validation_status: 'approved'
    };
    const accessToken = localStorage.getItem('loggedInUserToken');
    this.annonceService.updateAnnonce(this.adId, this.adDetail.uuid, formData, accessToken!).subscribe((log) => {
      console.log('Approved', log);
    });
  }
  
  reject() {
    // Logique pour rejeter
    this.ad.validation_status = 'rejected';
    const formData = {
      validation_status: 'rejected'
    };
    const accessToken = localStorage.getItem('loggedInUserToken');
    this.annonceService.updateAnnonce(this.adId, this.adDetail.uuid, formData, accessToken!).subscribe((log) => {
      console.log('Rejected', log);
    });
  }
  
  
}
