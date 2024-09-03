import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListClientsDeletedComponent } from './list-clients-deleted.component';

describe('ListClientsDeletedComponent', () => {
  let component: ListClientsDeletedComponent;
  let fixture: ComponentFixture<ListClientsDeletedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListClientsDeletedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListClientsDeletedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
