import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAttributsComponent } from './edit-attributs.component';

describe('EditAttributsComponent', () => {
  let component: EditAttributsComponent;
  let fixture: ComponentFixture<EditAttributsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditAttributsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditAttributsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
