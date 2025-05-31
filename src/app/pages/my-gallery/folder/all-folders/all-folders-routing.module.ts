import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AllFoldersComponent} from './all-folders.component';

const routes: Routes = [
  {
    path: '',
    component: AllFoldersComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AllFoldersRoutingModule { }
