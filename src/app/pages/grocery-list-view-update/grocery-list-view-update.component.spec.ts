import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroceryListViewUpdateComponent } from './grocery-list-view-update.component';

describe('GroceryListViewUpdateComponent', () => {
  let component: GroceryListViewUpdateComponent;
  let fixture: ComponentFixture<GroceryListViewUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroceryListViewUpdateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GroceryListViewUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
