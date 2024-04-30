import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressSpinnerSmComponent } from './progress-spinner-sm.component';

describe('ProgressSpinnerSmComponent', () => {
  let component: ProgressSpinnerSmComponent;
  let fixture: ComponentFixture<ProgressSpinnerSmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgressSpinnerSmComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProgressSpinnerSmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
