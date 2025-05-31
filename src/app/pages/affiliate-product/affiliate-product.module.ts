import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AffiliateProductRoutingModule } from './affiliate-product-routing.module';
import { AddAffiliateProductComponent } from './add-affiliate-product/add-affiliate-product.component';
import { AllAffiliateProductComponent } from './all-affiliate-product/all-affiliate-product.component';
import {MatButton, MatButtonModule} from "@angular/material/button";
import {MatFormField, MatFormFieldModule} from "@angular/material/form-field";
import {MatOption, MatSelect, MatSelectModule} from "@angular/material/select";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatInput, MatInputModule} from "@angular/material/input";
import {DigitOnlyModule} from "@uiowa/digit-only";
import {GalleryImagePickerComponent} from "../../shared/components/gallery-image-picker/gallery-image-picker.component";
import {MatIconModule} from "@angular/material/icon";
import {MatOptionModule} from "@angular/material/core";
import {MaterialModule} from "../../material/material.module";
import {PaginationComponent} from "../../shared/components/pagination/pagination.component";
import {GalleryImageViewerComponent} from "../../shared/components/gallery-image-viewer/gallery-image-viewer.component";
import {PageLoaderComponent} from "../../shared/components/page-loader/page-loader.component";
import {NoContentComponent} from "../../shared/components/no-content/no-content.component";
import {DaysRemainingPipe} from "../../shared/pipes/days-remaining.pipe";
import {LimitTextPipe} from "../../shared/pipes/limit-text.pipe";
import {BreadcrumbComponent} from "../../shared/components/breadcrumb/breadcrumb.component";
import {NgxPaginationModule} from "ngx-pagination";


@NgModule({
  declarations: [
    AddAffiliateProductComponent,
    AllAffiliateProductComponent
  ],
  imports: [
    CommonModule,
    AffiliateProductRoutingModule,
    DigitOnlyModule,
    GalleryImagePickerComponent,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    MaterialModule,
    ReactiveFormsModule,
    PaginationComponent,
    GalleryImageViewerComponent,
    PageLoaderComponent,
    NoContentComponent,
    DaysRemainingPipe,
    LimitTextPipe,
    FormsModule,
    BreadcrumbComponent,
    NgxPaginationModule
  ]
})
export class AffiliateProductModule { }
