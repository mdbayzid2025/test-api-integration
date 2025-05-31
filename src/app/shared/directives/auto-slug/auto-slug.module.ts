import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AutoSlugDirective} from "./auto-slug.directive";



@NgModule({
  declarations: [
    AutoSlugDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    AutoSlugDirective
  ]
})
export class AutoSlugModule { }
