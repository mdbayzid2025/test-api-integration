import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShopRoutingModule } from './shop-routing.module';
import { AddShopComponent } from './add-shop/add-shop.component';
import { AllShopComponent } from './all-shop/all-shop.component';
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
import {GalleryImageViewerComponent} from "../../shared/components/gallery-image-viewer/gallery-image-viewer.component";
import {LimitTextPipe} from "../../shared/pipes/limit-text.pipe";
import { PreShopComponent } from './pre-shop/pre-shop.component';
import {MatCardActions} from "@angular/material/card";
import { ShopReportComponent } from './shop-report/shop-report.component';


@NgModule({
  declarations: [
    AddShopComponent,
    AllShopComponent,
    PreShopComponent,
    ShopReportComponent
  ],
    imports: [
        CommonModule,
        ShopRoutingModule,
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
        GalleryImageViewerComponent,
        LimitTextPipe,
        MatCardActions,
    ]
})
export class ShopModule { }
