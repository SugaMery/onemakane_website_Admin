import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListUsersDeletedComponent } from './list-users-deleted.component';

describe('ListUsersDeletedComponent', () => {
  let component: ListUsersDeletedComponent;
  let fixture: ComponentFixture<ListUsersDeletedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListUsersDeletedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListUsersDeletedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
