import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {NgModelChangeDebouncedDirective} from './ng-model-change.directive';



@NgModule({
  declarations: [
    NgModelChangeDebouncedDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    NgModelChangeDebouncedDirective
  ]
})
export class NgModelChangeModule { }
