import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductRoutingModule } from './product-routing.module';
import { AddProductComponent } from './add-product/add-product.component';
import { AllProductComponent } from './all-product/all-product.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgxPaginationModule} from "ngx-pagination";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {MatButtonModule} from "@angular/material/button";
import {DigitOnlyModule} from "@uiowa/digit-only";
import {BreadcrumbComponent} from "../../shared/components/breadcrumb/breadcrumb.component";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatIconModule} from "@angular/material/icon";
import {MatMenuModule} from "@angular/material/menu";
import {MatTooltipModule} from "@angular/material/tooltip";
import {NoContentComponent} from "../../shared/components/no-content/no-content.component";
import {PageLoaderComponent} from "../../shared/components/page-loader/page-loader.component";
import {RoleViewPipe} from "../../shared/pipes/role-view.pipe";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {NoWhitespaceModule} from "../../shared/directives/no-whitespace/no-whitespace.module";
import { AddProductNewComponent } from './add-product-new/add-product-new.component';
import { AddCategoryComponent } from './catalog-popup/add-category/add-category.component';
import {MatCard} from "@angular/material/card";
import {GalleryModule} from "../gallery/gallery.module";
import {CdkDropList, DragDropModule} from "@angular/cdk/drag-drop";
import { AddTagComponent } from './catalog-popup/add-tag/add-tag.component';
import { AddSubCategoryComponent } from './catalog-popup/add-sub-category/add-sub-category.component';
import { AddChildCategoryComponent } from './catalog-popup/add-child-category/add-child-category.component';
import { AddBrandComponent } from './catalog-popup/add-brand/add-brand.component';


@NgModule({
  declarations: [
    AddProductComponent,
    AllProductComponent,
    AddProductNewComponent,
    AddCategoryComponent,
    AddTagComponent,
    AddSubCategoryComponent,
    AddChildCategoryComponent,
    AddBrandComponent
  ],
  imports: [
    CommonModule,
    ProductRoutingModule,
    FormsModule,
    NgxPaginationModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    DigitOnlyModule,
    ReactiveFormsModule,
    BreadcrumbComponent,
    MatCheckboxModule,
    MatIconModule,
    MatMenuModule,
    MatTooltipModule,
    NoContentComponent,
    PageLoaderComponent,
    RoleViewPipe,
    MatDatepickerModule,
    NoWhitespaceModule,
    MatCard,
    GalleryModule,
    CdkDropList,
    DragDropModule
  ]
})
export class ProductModule { }
