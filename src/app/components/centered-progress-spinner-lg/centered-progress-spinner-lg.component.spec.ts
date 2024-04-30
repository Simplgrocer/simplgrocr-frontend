import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CenteredProgressSpinnerLgComponent } from './centered-progress-spinner-lg.component';

describe('CenteredProgressSpinnerLgComponent', () => {
  let component: CenteredProgressSpinnerLgComponent;
  let fixture: ComponentFixture<CenteredProgressSpinnerLgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CenteredProgressSpinnerLgComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CenteredProgressSpinnerLgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
