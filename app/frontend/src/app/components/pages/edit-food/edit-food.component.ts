import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EditService } from 'src/app/services/edit.service';
import { IEditFood } from 'src/app/shared/interfaces/IEditFood';
import { FoodService } from 'src/app/services/food.service';
import { Food } from 'src/app/shared/models/Food';

@Component({
  selector: 'app-edit-food',
  templateUrl: './edit-food.component.html',
  styleUrls: ['./edit-food.component.css']
})
export class EditFoodComponent {

  editFoodForm!:FormGroup;
  isSubmitted = false;

  returnUrl = '';
  food!: Food;
  constructor(
    private formBuilder: FormBuilder,
    private editService: EditService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private foodService:FoodService
  ) { }

  ngOnInit(): void {
    // this.editFoodForm = this.formBuilder.group({
    //   name: ['', [Validators.required, Validators.minLength(5)]],
    //   price: ['', [Validators.required]],
    //   tags: ['', [Validators.required]],
    //   imageUrl: ['', [Validators.required]],
    //   origins: ['', Validators.required],
    //   cookTime: ['', [Validators.required]]
    // });

    this.activatedRoute.params.subscribe((params) => {
      if(params.id)
      this.foodService.getFoodById(params.id).subscribe(serverFood => {
        this.food = serverFood;

        const { id, name, price, tags, imageUrl, origins, cookTime } = this.food;

    this.editFoodForm = this.formBuilder.group({
      id: [id, [Validators.required]],
      name: [name, [Validators.required, Validators.minLength(5)]],
      price: [price, [Validators.required]],
      tags: [tags, [Validators.required]],
      imageUrl: [imageUrl, [Validators.required]],
      origins: [origins, Validators.required],
      cookTime: [cookTime, [Validators.required]]
    });

    this.returnUrl= this.activatedRoute.snapshot.queryParams.returnUrl;
      });
    }) 
    
  }

  get fc() {
    return this.editFoodForm.controls;
  }

  submit(){
    this.isSubmitted = true;
    if(this.editFoodForm.invalid) return;
    const fv = this.editFoodForm.value;
    const food :IEditFood = {
      id: fv.id,
      name: fv.name,
      price: fv.price,
      tags: fv.tags,
      imageUrl: fv.imageUrl,
      origins: fv.origins,
      cookTime: fv.cookTime
    };
    this.editService.editFood(food).subscribe(_ => {
      this.router.navigateByUrl('food/' + food.id);
    })
  }

}
