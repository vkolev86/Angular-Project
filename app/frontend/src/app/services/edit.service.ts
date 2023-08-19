import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { EDIT_FOOD_BY_ID_URL } from '../shared/constants/urls';
import { Food } from '../shared/models/Food';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { IEditFood } from '../shared/interfaces/IEditFood';

const USER_KEY = 'Food';
@Injectable({
  providedIn: 'root'
})
export class EditService {
  food!:Food;
  private editSubject = new BehaviorSubject<Food>(this.food);
  public foodObservable!: Observable<Food>;
  constructor(private http: HttpClient, private toastrService:ToastrService) { }

editFood(food:IEditFood): Observable<Food>{
    return this.http.post<Food>(EDIT_FOOD_BY_ID_URL + food.id, food).pipe(
      tap({
        next: (food) => {
          this.editSubject.next(food);
          this.toastrService.success(
            `Successful`,
            `Food ${food.name} is updated!`, {
              positionClass: 'toast-top-right' 
           }
          )
        },
        error: (errorResponse: { error: any; }) => {
          this.toastrService.error(errorResponse.error,
            'Update Food Failed!', {
              positionClass: 'toast-top-right' 
           })
        }
      })
    )
  }

}
