import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnoncesApprouveesComponent } from './annonces-approuvees.component';

describe('AnnoncesApprouveesComponent', () => {
  let component: AnnoncesApprouveesComponent;
  let fixture: ComponentFixture<AnnoncesApprouveesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AnnoncesApprouveesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AnnoncesApprouveesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
