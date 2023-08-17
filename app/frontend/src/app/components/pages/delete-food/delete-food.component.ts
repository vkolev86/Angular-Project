import { Component, Input } from '@angular/core';
import { Food } from 'src/app/shared/models/Food';
import { DeleteService } from 'src/app/services/delete.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-delete-food',
  templateUrl: './delete-food.component.html',
  styleUrls: ['./delete-food.component.css']
})
export class DeleteFoodComponent {
  @Input()
  deletedText = "Food is deleted!";
  @Input()
  homeLinkText = "Back to home";
  @Input()
  homeLinkRoute = "/";
  food!: Food;
  constructor(private deleteService: DeleteService, private router: Router) { }

  ngOnInit(): void {
  }
 
  deleteFood(){
    this.deleteService.deleteFood(this.food.id)
    this.router.navigateByUrl('/delete/'+ this.food.id);
  }
}
