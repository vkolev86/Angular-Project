import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { DELETE_FOOD_URL } from '../shared/constants/urls';
import { Food } from '../shared/models/Food';

@Injectable({
  providedIn: 'root'
})
export class DeleteService {
  food!:Food;
  private deleteSubject = new BehaviorSubject<Food>(this.food);
  public foodObservable!: Observable<Food>;
  constructor(private http: HttpClient, private toastrService:ToastrService) { }

deleteFood(foodId:string): Observable<Food>{
    return this.http.delete<Food>(DELETE_FOOD_URL + foodId).pipe(
      tap({
        next: (food) => {
          this.deleteSubject.next(food);
          this.toastrService.success(
            `Successful`,
            `Food ${food.name} is deleted!`, {
              positionClass: 'toast-top-right' 
           }
          )
        },
        error: (errorResponse: { error: any; }) => {
          this.toastrService.error(errorResponse.error,
            'Deleted Food Failed!', {
              positionClass: 'toast-top-right' 
           })
        }
      })
    )
  }

}
