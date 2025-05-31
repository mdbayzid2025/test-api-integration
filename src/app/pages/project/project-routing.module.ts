import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AllProjectComponent} from './all-project/all-project.component';
import {AddProjectComponent} from './add-project/add-project.component';
import {AllPendingProjectComponent} from './all-pending-project/all-pending-project.component';
import {AddBlacklistProjectComponent} from './add-blacklist-project/add-blacklist-project.component';

const routes: Routes = [
  {path: '', component: AllProjectComponent},
  {path: 'black-list', component: AllPendingProjectComponent},
  {path: 'add', component: AddProjectComponent},
  {path: 'edit/:id', component: AddProjectComponent},
  {path: 'add-blacklist', component: AddBlacklistProjectComponent},
  {path: 'edit-blacklist/:id', component: AddBlacklistProjectComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectRoutingModule { }
