import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListClientDeletedComponent } from './list-client-deleted.component';

describe('ListClientDeletedComponent', () => {
  let component: ListClientDeletedComponent;
  let fixture: ComponentFixture<ListClientDeletedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListClientDeletedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListClientDeletedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
