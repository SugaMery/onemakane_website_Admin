import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditGestionRolesComponent } from './edit-gestion-roles.component';

describe('EditGestionRolesComponent', () => {
  let component: EditGestionRolesComponent;
  let fixture: ComponentFixture<EditGestionRolesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditGestionRolesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditGestionRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
