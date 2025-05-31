import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {MyGalleryComponent} from './my-gallery.component';

const routes: Routes = [
  {
    path: '',
    component: MyGalleryComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyGalleryRoutingModule { }
