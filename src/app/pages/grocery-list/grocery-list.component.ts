import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

interface MeasurementUnit {
  id: number;
  value: 'Unit' | 'Kilogram' | 'Gram';
}

@Component({
  selector: 'app-grocery-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './grocery-list.component.html',
  styleUrl: './grocery-list.component.css',
})
export class GroceryListComponent implements OnInit {
  measurementUnits: MeasurementUnit[] = [
    { id: 1, value: 'Unit' },
    { id: 2, value: 'Kilogram' },
    { id: 3, value: 'Gram' },
  ];

  groceryListForm!: FormGroup;

  ngOnInit(): void {
    this.groceryListForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      items: new FormArray([
        new FormGroup({
          name: new FormControl('', [Validators.required]),
          quantityMeasurementUnit: new FormControl('', [Validators.required]),
          quantity: new FormControl('', [Validators.required]),
          rateMeasurementUnit: new FormControl('', [Validators.required]),
          rate: new FormControl('', [Validators.required]),
          price: new FormControl('', [Validators.required]),
        }),
      ]),
    });
  }

  getItemsArrayControls(): AbstractControl<any, any>[] {
    return (this.groceryListForm.get('items') as FormArray).controls;
  }

  addItem(): void {
    (this.groceryListForm.get('items') as FormArray).push(
      new FormArray([
        new FormGroup({
          name: new FormControl('', [Validators.required]),
          quantityMeasurementUnit: new FormControl('', [Validators.required]),
          quantity: new FormControl('', [Validators.required]),
          rateMeasurementUnit: new FormControl('', [Validators.required]),
          rate: new FormControl('', [Validators.required]),
          price: new FormControl('', [Validators.required]),
        }),
      ])
    );
  }

  deleteItem(index: number): void {
    (this.groceryListForm.get('items') as FormArray).removeAt(index);
  }

  onSubmit(): void {
    console.log(this.groceryListForm);
  }
}
