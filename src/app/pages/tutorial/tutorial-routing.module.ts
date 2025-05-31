import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AllTutorialComponent} from "./all-tutorial/all-tutorial.component";
import {AddTutorialComponent} from "./add-tutorial/add-tutorial.component";

const routes: Routes = [
  {path: '', redirectTo: 'all-tutorial', pathMatch: 'full'},
  {path: 'all-tutorial', component: AllTutorialComponent},
  {path: 'add-tutorial', component: AddTutorialComponent},
  {path: 'edit/:id', component: AddTutorialComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TutorialRoutingModule { }
