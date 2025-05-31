import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VendorRoutingModule } from './vendor-routing.module';
import { AllVendorComponent } from './all-vendor/all-vendor.component';
import { AddVendorComponent } from './add-vendor/add-vendor.component';
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
import {GalleryImageViewerComponent} from "../../shared/components/gallery-image-viewer/gallery-image-viewer.component";
import {MatDatepicker, MatDatepickerModule, MatDatepickerToggle} from "@angular/material/datepicker";
import {GalleryImagePickerComponent} from "../../shared/components/gallery-image-picker/gallery-image-picker.component";


@NgModule({
  declarations: [
    AllVendorComponent,
    AddVendorComponent
  ],
  imports: [
    CommonModule,
    VendorRoutingModule,
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
    ImageCropComponent,
    GalleryImageViewerComponent,
    MatDatepickerToggle,
    MatDatepicker,
    MatDatepickerModule,
    GalleryImagePickerComponent,
  ]
})
export class VendorModule { }
