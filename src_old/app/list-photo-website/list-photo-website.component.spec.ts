import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPhotoWebsiteComponent } from './list-photo-website.component';

describe('ListPhotoWebsiteComponent', () => {
  let component: ListPhotoWebsiteComponent;
  let fixture: ComponentFixture<ListPhotoWebsiteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListPhotoWebsiteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListPhotoWebsiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
