import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TestRoutingModule } from './test-routing.module';
import { TestComponent } from './test.component';
import {HtmlEditorComponent} from '../../shared/components/html-editor/html-editor.component';
import { TwoComponent } from './two/two.component';
import {ReactiveFormsModule} from '@angular/forms';
import {MatError, MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatButton} from '@angular/material/button';


@NgModule({
  declarations: [
    TestComponent,
    TwoComponent
  ],
  imports: [
    CommonModule,
    TestRoutingModule,
    HtmlEditorComponent,
    ReactiveFormsModule,
    MatError,
    MatFormField,
    MatInput,
    MatLabel,
    MatButton
  ]
})
export class TestModule { }
