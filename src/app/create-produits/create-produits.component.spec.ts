import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateProduitsComponent } from './create-produits.component';

describe('CreateProduitsComponent', () => {
  let component: CreateProduitsComponent;
  let fixture: ComponentFixture<CreateProduitsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateProduitsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateProduitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
