import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FoodService } from 'src/app/services/food.service';
import { INewFood } from 'src/app/shared/interfaces/INewFood';

@Component({
  selector: 'app-add-food',
  templateUrl: './add-food.component.html',
  styleUrls: ['./add-food.component.css']
})
export class AddFoodComponent implements OnInit {

  addFoodForm!:FormGroup;
  isSubmitted = false;

  returnUrl = '';
  constructor(
    private formBuilder: FormBuilder,
    private foodService: FoodService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.addFoodForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(5)]],
      price: ['', [Validators.required]],
      tags: ['', [Validators.required]],
      favorite: [''],
      stars: [''],
      imageUrl: ['', [Validators.required]],
      origins: ['', Validators.required],
      cookTime: ['', [Validators.required]]
    });

    this.returnUrl= this.activatedRoute.snapshot.queryParams.returnUrl;
  }

  get fc() {
    return this.addFoodForm.controls;
  }

  submit(){
    this.isSubmitted = true;
    if(this.addFoodForm.invalid) return;

    const fv= this.addFoodForm.value;
    const food :INewFood = {
      name: fv.name,
      price: fv.price,
      tags: fv.tags,
      favorite: fv.favorite,
      stars: fv.stars,
      imageUrl: fv.imageUrl,
      origins: fv.origins,
      cookTime: fv.cookTime
    };

    this.foodService.addFood(food).subscribe(_ => {
      this.router.navigateByUrl(this.returnUrl);
    })
  }

}
