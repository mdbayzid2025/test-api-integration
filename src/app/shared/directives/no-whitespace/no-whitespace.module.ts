import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {NoWhitespaceDirective} from "./no-whitespace.directive";



@NgModule({
  declarations: [
    NoWhitespaceDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    NoWhitespaceDirective
  ]
})
export class NoWhitespaceModule { }
