import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { FOODS_BY_SEARCH_URL, FOODS_BY_TAG_URL, FOODS_TAGS_URL, FOODS_URL, FOOD_BY_ID_URL, ADD_FOOD_URL, EDIT_FOOD_BY_ID_URL } from '../shared/constants/urls';
import { Food } from '../shared/models/Food';
import { Tag } from '../shared/models/Tag';
import { INewFood } from '../shared/interfaces/INewFood';

const USER_KEY = 'Food';
@Injectable({
  providedIn: 'root'
})
export class FoodService {
  private foodSubject =
  new BehaviorSubject<Food>(this.getFoodFromLocalStorage());
  public foodObservable!: Observable<Food>;

  constructor(private http:HttpClient, private toastrService:ToastrService) { }

  getAll(): Observable<Food[]> {
    return this.http.get<Food[]>(FOODS_URL);
  }

  getAllFoodsBySearchTerm(searchTerm: string) {
    return this.http.get<Food[]>(FOODS_BY_SEARCH_URL + searchTerm);
  }

  getAllTags(): Observable<Tag[]> {
    return this.http.get<Tag[]>(FOODS_TAGS_URL);
  }

  getAllFoodsByTag(tag: string): Observable<Food[]> {
    return tag === "All" ?
      this.getAll() :
      this.http.get<Food[]>(FOODS_BY_TAG_URL + tag);
  }

  getFoodById(foodId:string):Observable<Food>{
    return this.http.get<Food>(FOOD_BY_ID_URL + foodId);
  }

  addFood(newFood:INewFood): Observable<Food>{
    return this.http.post<Food>(ADD_FOOD_URL, newFood).pipe(
      tap({
        next: (food) => {
          this.foodSubject.next(food);
          this.toastrService.success(
            `Successful`,
            `New food added: ${food.name}`, {
              positionClass: 'toast-top-right' 
           }
          )
        },
        error: (errorResponse: { error: any; }) => {
          this.toastrService.error(errorResponse.error,
            'Add New Food Failed', {
              positionClass: 'toast-top-right' 
           })
        }
      })
    )
  }

  editFood(foodId:string):Observable<Food>{
    return this.http.get<Food>(EDIT_FOOD_BY_ID_URL + foodId);
  }

  private getFoodFromLocalStorage():Food{
    const userJson = localStorage.getItem(USER_KEY);
    if(userJson) return JSON.parse(userJson) as Food;
    return new Food();
  }

}
