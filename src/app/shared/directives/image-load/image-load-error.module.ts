import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ImageLoadErrorDirective} from './image-load-error.directive';



@NgModule({
  declarations: [
    ImageLoadErrorDirective,
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ImageLoadErrorDirective,
  ]
})
export class ImageLoadErrorModule { }
