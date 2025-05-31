import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {UserRoutingModule} from './user-routing.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {DigitOnlyModule} from '@uiowa/digit-only';
import {AllUserComponent} from './all-user/all-user.component';
import {AddUserComponent} from './add-user/add-user.component';
import {MatMenuModule} from '@angular/material/menu';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {NgxPaginationModule} from 'ngx-pagination';
import { ImageCropperModule } from 'ngx-image-cropper';
import {BreadcrumbComponent} from '../../shared/components/breadcrumb/breadcrumb.component';
import {PageLoaderComponent} from '../../shared/components/page-loader/page-loader.component';
import {NoContentComponent} from '../../shared/components/no-content/no-content.component';
import {NoWhitespaceModule} from '../../shared/directives/no-whitespace/no-whitespace.module';
import {AutoSlugModule} from '../../shared/directives/auto-slug/auto-slug.module';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {RoleViewPipe} from '../../shared/pipes/role-view.pipe';
import {ImageCropComponent} from '../../shared/components/image-crop/image-crop.component';


@NgModule({
  declarations: [
    AllUserComponent,
    AddUserComponent,
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    BreadcrumbComponent,
    DigitOnlyModule,
    FormsModule,
    MatMenuModule,
    MatTooltipModule,
    MatCheckboxModule,
    NgxPaginationModule,
    PageLoaderComponent,
    NoContentComponent,
    NoWhitespaceModule,
    AutoSlugModule,
    ImageCropperModule,
    MatProgressSpinnerModule,
    RoleViewPipe,
    ImageCropComponent
  ]
})
export class UserModule {
}
