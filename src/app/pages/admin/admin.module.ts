import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AddAdminComponent } from './add-admin/add-admin.component';
import { AllAdminComponent } from './all-admin/all-admin.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DigitOnlyModule } from '@uiowa/digit-only';
import { ImageCropperModule } from 'ngx-image-cropper';
import { NgxPaginationModule } from 'ngx-pagination';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';
import { ImageCropComponent } from '../../shared/components/image-crop/image-crop.component';
import { NoContentComponent } from '../../shared/components/no-content/no-content.component';
import { PageLoaderComponent } from '../../shared/components/page-loader/page-loader.component';
import { AutoSlugModule } from '../../shared/directives/auto-slug/auto-slug.module';
import { NoWhitespaceModule } from '../../shared/directives/no-whitespace/no-whitespace.module';
import { RoleViewPipe } from '../../shared/pipes/role-view.pipe';


@NgModule({
  declarations: [
    AddAdminComponent,
    AllAdminComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
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
export class AdminModule { }
