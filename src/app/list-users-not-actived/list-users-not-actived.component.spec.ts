import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListUsersNotActivedComponent } from './list-users-not-actived.component';

describe('ListUsersNotActivedComponent', () => {
  let component: ListUsersNotActivedComponent;
  let fixture: ComponentFixture<ListUsersNotActivedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListUsersNotActivedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListUsersNotActivedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
