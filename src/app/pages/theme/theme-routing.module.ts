import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AddThemeComponent} from "./add-theme/add-theme.component";
import {AllThemeComponent} from "./all-theme/all-theme.component";
import {AllCategoryComponent} from "./category/all-category/all-category.component";
import {AllSubCategoryComponent} from "./sub-category/all-sub-category/all-sub-category.component";
import {AddCategoryComponent} from "./category/add-category/add-category.component";
import {AddSubCategoryComponent} from "./sub-category/add-sub-category/add-sub-category.component";

const routes: Routes = [
  {path: '', redirectTo: 'all-theme', pathMatch: 'full'},
  {path: 'all-theme', component: AllThemeComponent},
  {path: 'all-categories', component: AllCategoryComponent},
  {path: 'all-sub-categories', component: AllSubCategoryComponent},
  {path: 'add-category', component: AddCategoryComponent},
  {path: 'edit-category/:id', component: AddCategoryComponent},
  {path: 'edit-subCategory/:id', component: AddSubCategoryComponent},
  {path: 'add-sub-category', component: AddSubCategoryComponent},
  {path: 'add-theme', component: AddThemeComponent},
  {path: 'edit/:id', component: AddThemeComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ThemeRoutingModule { }
