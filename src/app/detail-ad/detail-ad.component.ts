import { Component, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AnnonceService } from '../annonce.service';
import { DOCUMENT } from '@angular/common';
import { CategoryService } from '../category.service';
import { SettingService } from '../setting.service';
import { Category1Service } from '../category1.service';
import { Message, MessageService } from 'primeng/api';

@Component({
  selector: 'app-detail-ad',
  templateUrl: './detail-ad.component.html',
  styleUrls: ['./detail-ad.component.css']
})
export class DetailAdComponent {
  ad: any;
  adId: string = '';
  adDetail: any = [];
  messages: Message[] = [];

  constructor(
    private route: ActivatedRoute,
    private annonceService: AnnonceService,
    @Inject(DOCUMENT) private document: Document,
    private categoryService: Category1Service,
    private settingService: SettingService,
    private messageService: MessageService
  ) {}

  transformedField: any[] | undefined;

  ngOnInit(): void {
    const adId = this.route.snapshot.paramMap.get('id');
    this.getAdDetails(adId!);

    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id !== null) {
        this.adId = id;

        if (this.document.defaultView && this.document.defaultView.localStorage) {
          const accessToken = this.document.defaultView.localStorage.getItem('loggedInUserToken');
          this.annonceService.getAdById(this.adId).subscribe((data) => {
            this.adDetail = data.data;
            this.categoryService.getCategoryById(data.data.category_id).subscribe((category) => {
              const modelFields = category.data.model_fields;
              const queryParams = { model: category.data.model };
              this.settingService.getSettings(accessToken!, queryParams).subscribe(
                (setting) => {
                  if (setting.data) {
                    const transformedFields = Object.keys(modelFields).map((key) => ({
                      value: key,
                      label: modelFields[key].label,
                      setting: key,
                      type: modelFields[key].type,
                      options: modelFields[key].options,
                      dependant: modelFields[key].dependant,
                    }));

                    transformedFields.forEach((field) => {
                      if (modelFields[field.value].route) {
                        const fieldValue = data.data.additional[field.value];
                        this.settingService.createMarque(modelFields[field.value].route, accessToken!).subscribe((response) => {
                          const marquesPopulaires = response.data['Marques populaires'];
                          const autresMarques = response.data['Autres marques'];
                          const marquesPopulairesArray = Object.entries(marquesPopulaires).map(([key, value]) => ({
                            id: key,
                            name: value,
                          }));
                          const autresMarquesArray = Object.entries(autresMarques).map(([key, value]) => ({
                            id: key,
                            name: value,
                          }));
                          const allMarquesArray = [...marquesPopulairesArray, ...autresMarquesArray];
                          const filteredResponse = allMarquesArray.filter((item: { id: string }) => item.id === String(fieldValue));

                          if (filteredResponse.length > 0) {
                            field.setting = filteredResponse[0].name!.toString();
                          }
                        });
                      } else if (!modelFields[field.value].options && modelFields[field.value].type === 'select' && !modelFields[field.value].dependant) {
                        const matchedSetting = setting.data.find((settingItem: { name: string }) => settingItem.name === field.value);

                        if (matchedSetting) {
                          if (data.data.additional && data.data.additional[field.value]) {
                            field.setting = matchedSetting.content[data.data.additional[field.value]];
                          } else {
                            console.error(`No additional data found for key '${field.value}'`);
                          }
                        } else {
                          console.error(`No setting found for key '${field.value}'`, field, modelFields);
                        }
                      } else if (
                        modelFields[field.value].type === 'number' ||
                        modelFields[field.value].type === 'text' ||
                        modelFields[field.value].type === 'date' ||
                        modelFields[field.value].type === 'int'
                      ) {
                        field.setting = data.data.additional[field.value];
                      } else if (modelFields[field.value].options && modelFields[field.value].type !== 'bool') {
                        field.setting = modelFields[field.value].options[data.data.additional[field.value]];
                        console.error(`No setting found for key '${field.value}'`, field, modelFields);
                      } else if (modelFields[field.value].type === 'multiple') {
                        try {
                          field.setting = JSON.parse(data.data.additional[field.value]);
                        } catch (error) {
                          console.error('Error parsing JSON:', error);
                        }
                      } else if (modelFields[field.value].type === 'bool' && modelFields[field.value].conditions) {
                        field.setting = data.data.additional[field.value] === 1 ? 'Oui' : 'Non';
                      } else if (modelFields[field.value].dependant) {
                        const model = modelFields[field.value].dependant;
                        const matchedSetting = setting.data.find((settingItem: { name: string }) => settingItem.name === field.value);

                        if (matchedSetting) {
                          if (data.data.additional && data.data.additional[field.value]) {
                            const test = matchedSetting.content[data.data.additional[model]];
                            field.setting = test[data.data.additional[field.value]];
                          } else {
                            console.error(`No additional data found for key '${model}'`);
                          }
                        } else {
                          console.error(`No setting found for key '${field.value}'`, field, modelFields);
                        }
                      }
                    });

                    this.transformedField = transformedFields.filter((fild) => fild.value !== 'need_cv');
                    this.ad.setting = transformedFields.filter((fild) => fild.setting);
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
      }
    });
  }

  getAdDetails(id: string): void {
    this.annonceService.getAdById(id).subscribe((ad) => {
      this.ad = ad.data;
    });
  }

  saveAsDraft() {
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
    this.ad.validation_status = 'approved';
    const formData = {
      validation_status: 'approved'
    };
    const accessToken = localStorage.getItem('loggedInUserToken');
    this.annonceService.updateAnnonce(this.adId, this.adDetail.uuid, formData, accessToken!).subscribe({
      next: (log) => {
        this.messageService.add({severity: 'success', summary: 'Succès', detail: 'Annonce approuvée avec succès'});
        console.log('Approved', log);
        this.clearMessagesAfterDelay();
      },
      error: (err) => {
        this.messageService.add({severity: 'error', summary: 'Erreur', detail: 'Échec de l\'approbation de l\'annonce'});
        console.error('Approval error', err);
        this.clearMessagesAfterDelay();
      }
    });
  }

  reject() {
    this.ad.validation_status = 'rejected';
    const formData = {
      validation_status: 'rejected'
    };
    const accessToken = localStorage.getItem('loggedInUserToken');
    this.annonceService.updateAnnonce(this.adId, this.adDetail.uuid, formData, accessToken!).subscribe({
      next: (log) => {
        this.messageService.add({severity: 'error', summary: 'Succès', detail: 'Annonce rejetée avec succès'});
        console.log('Rejected', log);
        this.clearMessagesAfterDelay();
      },
      error: (err) => {
        this.messageService.add({severity: 'error', summary: 'Erreur', detail: 'Échec du rejet de l\'annonce'});
        console.error('Rejection error', err);
        this.clearMessagesAfterDelay();
      }
    });
  }

  clearMessagesAfterDelay() {
    setTimeout(() => {
      this.messages = [];
    }, 5000); // 5000 ms = 5 seconds
  }
}
