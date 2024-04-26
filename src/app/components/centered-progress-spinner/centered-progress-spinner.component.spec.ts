import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CenteredProgressSpinnerComponent } from './centered-progress-spinner.component';

describe('CenteredProgressSpinnerComponent', () => {
  let component: CenteredProgressSpinnerComponent;
  let fixture: ComponentFixture<CenteredProgressSpinnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CenteredProgressSpinnerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CenteredProgressSpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
