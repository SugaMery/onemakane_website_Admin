import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateMarquesComponent } from './create-marques.component';

describe('CreateMarquesComponent', () => {
  let component: CreateMarquesComponent;
  let fixture: ComponentFixture<CreateMarquesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateMarquesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateMarquesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
