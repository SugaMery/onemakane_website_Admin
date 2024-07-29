import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnoncesRejeteesComponent } from './annonces-rejetees.component';

describe('AnnoncesRejeteesComponent', () => {
  let component: AnnoncesRejeteesComponent;
  let fixture: ComponentFixture<AnnoncesRejeteesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AnnoncesRejeteesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AnnoncesRejeteesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
