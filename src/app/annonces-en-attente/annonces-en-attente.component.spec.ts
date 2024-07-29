import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnoncesEnAttenteComponent } from './annonces-en-attente.component';

describe('AnnoncesEnAttenteComponent', () => {
  let component: AnnoncesEnAttenteComponent;
  let fixture: ComponentFixture<AnnoncesEnAttenteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AnnoncesEnAttenteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AnnoncesEnAttenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
