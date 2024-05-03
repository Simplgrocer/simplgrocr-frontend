import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApplicationStateService {
  private isInteractionFreezedSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isInteractionFreezed$: Observable<boolean> = this.isInteractionFreezedSubject.asObservable();
  
  constructor() { }

  setInteractionFreezed(value: boolean) {
    this.isInteractionFreezedSubject.next(value);
  }
}
