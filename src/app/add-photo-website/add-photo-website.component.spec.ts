import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPhotoWebsiteComponent } from './add-photo-website.component';

describe('AddPhotoWebsiteComponent', () => {
  let component: AddPhotoWebsiteComponent;
  let fixture: ComponentFixture<AddPhotoWebsiteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddPhotoWebsiteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddPhotoWebsiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
