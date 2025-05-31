import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AddCategoryComponent} from "./add-category/add-category.component";
import {AllCategoryComponent} from "./all-category/all-category.component";

const routes: Routes = [
  {path: 'all-category', component: AllCategoryComponent},
  {path: 'add-category', component: AddCategoryComponent},
  {path: 'edit/:id', component: AddCategoryComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoryRoutingModule { }
