import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCaracteristiquesComponent } from './edit-caracteristiques.component';

describe('EditCaracteristiquesComponent', () => {
  let component: EditCaracteristiquesComponent;
  let fixture: ComponentFixture<EditCaracteristiquesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditCaracteristiquesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditCaracteristiquesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
