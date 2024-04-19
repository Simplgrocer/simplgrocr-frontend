import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroceryListCreateComponent } from './grocery-list-create.component';

describe('GroceryListCreateComponent', () => {
  let component: GroceryListCreateComponent;
  let fixture: ComponentFixture<GroceryListCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroceryListCreateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GroceryListCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
