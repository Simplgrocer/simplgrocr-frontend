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
import { GroceryListService } from '../../services/grocery-list.service';

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

  constructor(private groceryListService: GroceryListService) {}

  ngOnInit(): void {
    this.groceryListForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      items: new FormArray([
        new FormGroup({
          name: new FormControl('', [Validators.required]),
          rateMeasurementQuantity: new FormControl(0, [Validators.required]),
          rateMeasurementUnit: new FormControl(1, [Validators.required]),
          rate: new FormControl(0, [Validators.required]),
          quantityMeasurementUnit: new FormControl(1, [Validators.required]),
          quantity: new FormControl(0, [Validators.required]),
          price: new FormControl(0, [Validators.required]),
        }),
      ]),
    });
  }

  getItemsArrayControls(): AbstractControl<any, any>[] {
    return (this.groceryListForm.get('items') as FormArray).controls;
  }

  addItem(): void {
    (this.groceryListForm.get('items') as FormArray).push(
      new FormGroup({
        name: new FormControl('', [Validators.required]),
        rateMeasurementQuantity: new FormControl(0, [Validators.required]),
        rateMeasurementUnit: new FormControl(1, [Validators.required]),
        rate: new FormControl(0, [Validators.required]),
        quantityMeasurementUnit: new FormControl(1, [Validators.required]),
        quantity: new FormControl(0, [Validators.required]),
        price: new FormControl(0, [Validators.required]),
      })
    );
  }

  deleteItem(index: number): void {
    (this.groceryListForm.get('items') as FormArray).removeAt(index);
  }

  updateItemPrice(index: number): void {
    const itemPrice = this.groceryListService.getItemPrice(
      (
        (this.groceryListForm.controls['items'] as FormArray).controls[
          index
        ] as FormGroup
      ).controls['rateMeasurementQuantity'].value,
      this.measurementUnits.find(
        (obj) =>
          obj.id ===
          (
            (this.groceryListForm.controls['items'] as FormArray).controls[
              index
            ] as FormGroup
          ).controls['rateMeasurementUnit'].value
      )!.value,
      (
        (this.groceryListForm.controls['items'] as FormArray).controls[
          index
        ] as FormGroup
      ).controls['rate'].value,
      this.measurementUnits.find(
        (obj) =>
          obj.id ===
          (
            (this.groceryListForm.controls['items'] as FormArray).controls[
              index
            ] as FormGroup
          ).controls['quantityMeasurementUnit'].value
      )!.value,
      (
        (this.groceryListForm.controls['items'] as FormArray).controls[
          index
        ] as FormGroup
      ).controls['quantity'].value
    );

    (
      (this.groceryListForm.controls['items'] as FormArray).controls[
        index
      ] as FormGroup
    ).controls['price'].setValue(itemPrice);
  }

  async onSubmit(): Promise<void> {
    const groceryListForm = this.groceryListForm.value;

    const groceryListId = await this.groceryListService.addList({name: groceryListForm.name});

    for (let i = 1; i < groceryListForm.length; i++) {
      groceryListForm[i] = {groceryListId, ...groceryListForm[i]}
    }

    const itemsAdditionStatus = await this.groceryListService.addListItems(groceryListForm.items);
  }
}
