import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreselectionCvsComponent } from './preselection-cvs.component';

describe('PreselectionCvsComponent', () => {
  let component: PreselectionCvsComponent;
  let fixture: ComponentFixture<PreselectionCvsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PreselectionCvsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PreselectionCvsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
