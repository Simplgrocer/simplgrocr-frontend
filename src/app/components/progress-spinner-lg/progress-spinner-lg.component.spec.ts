import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressSpinnerLgComponent } from './progress-spinner-lg.component';

describe('ProgressSpinnerLgComponent', () => {
  let component: ProgressSpinnerLgComponent;
  let fixture: ComponentFixture<ProgressSpinnerLgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgressSpinnerLgComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProgressSpinnerLgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
