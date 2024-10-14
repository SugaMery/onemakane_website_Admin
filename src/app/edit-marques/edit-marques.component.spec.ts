import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMarquesComponent } from './edit-marques.component';

describe('EditMarquesComponent', () => {
  let component: EditMarquesComponent;
  let fixture: ComponentFixture<EditMarquesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditMarquesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditMarquesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
