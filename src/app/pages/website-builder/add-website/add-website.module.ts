import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AddWebsiteRoutingModule} from './add-website-routing.module';
import {AddWebsiteComponent} from './add-website.component';
import {BreadcrumbComponent} from '../../../shared/components/breadcrumb/breadcrumb.component';
import {ReactiveFormsModule} from '@angular/forms';
import {MatRadioButton, MatRadioGroup} from '@angular/material/radio';
import {MatCheckbox} from '@angular/material/checkbox';
import {MatError, MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatOption, MatSelect} from '@angular/material/select';
import {MatButton} from '@angular/material/button';
import {NoWhitespaceModule} from '../../../shared/directives/no-whitespace/no-whitespace.module';
import {MatIcon} from '@angular/material/icon';


@NgModule({
  declarations: [
    AddWebsiteComponent
  ],
  imports: [
    CommonModule,
    AddWebsiteRoutingModule,
    BreadcrumbComponent,
    ReactiveFormsModule,
    MatRadioGroup,
    MatRadioButton,
    MatCheckbox,
    MatFormField,
    MatInput,
    MatSelect,
    MatOption,
    MatButton,
    NoWhitespaceModule,
    MatIcon,
    MatError,
    MatLabel,
  ]
})
export class AddWebsiteModule {
}
