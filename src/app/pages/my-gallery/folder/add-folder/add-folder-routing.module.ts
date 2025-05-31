import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AddFolderComponent} from './add-folder.component';

const routes: Routes = [
  {
    path: '',
    component: AddFolderComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddFolderRoutingModule { }
