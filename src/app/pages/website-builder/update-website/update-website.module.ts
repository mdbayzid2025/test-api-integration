import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UpdateWebsiteRoutingModule} from './update-website-routing.module';
import {UpdateWebsiteComponent} from './update-website.component';
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
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';


@NgModule({
  declarations: [
    UpdateWebsiteComponent
  ],
  imports: [
    CommonModule,
    UpdateWebsiteRoutingModule,
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
    MatMenu,
    MatMenuTrigger,
    MatMenuItem,
  ]
})
export class UpdateWebsiteModule {
}
