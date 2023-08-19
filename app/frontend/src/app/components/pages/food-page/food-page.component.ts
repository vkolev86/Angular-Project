import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from 'src/app/services/cart.service';
import { FoodService } from 'src/app/services/food.service';
import { Food } from 'src/app/shared/models/Food';
import { DeleteService } from 'src/app/services/delete.service';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/shared/models/User';


@Component({
  selector: 'app-food-page',
  templateUrl: './food-page.component.html',
  styleUrls: ['./food-page.component.css']
})
export class FoodPageComponent implements OnInit {
  food!: Food;
  user!:User;
  editService: any;
  constructor(activatedRoute:ActivatedRoute, private foodService:FoodService,
    private cartService:CartService, private deleteService: DeleteService, private router: Router, private userService:UserService) {
    activatedRoute.params.subscribe((params) => {
      if(params.id)
      foodService.getFoodById(params.id).subscribe(serverFood => {
        this.food = serverFood;
      });
    })
    userService.userObservable.subscribe((newUser) => {
      this.user = newUser;
    })
   }

  ngOnInit(): void {
  }
  
  get isAuth(){
    return this.user.token;
  }
  get isAdmin(){
    return this.user.isAdmin;
  }

  addToCart(){
    this.cartService.addToCart(this.food);
    this.router.navigateByUrl('/cart-page');
  }
 
  deleteFood(){
    this.deleteService.deleteFood(this.food.id).subscribe(() => console.log("food is deleted!"));
    this.router.navigateByUrl('/delete/'+ this.food.id);
  }

  editFood(){
    // this.editService.editFood(this.food.id);
    this.router.navigateByUrl('/editFood/'+ this.food.id);
  }
}
