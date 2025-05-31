import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaymentLinkRoutingModule } from './payment-link-routing.module';
import { AddPaymentLinkComponent } from './add-payment-link/add-payment-link.component';
import { AllPaymentLinkComponent } from './all-payment-link/all-payment-link.component';
import {DigitOnlyModule} from "@uiowa/digit-only";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {GalleryImagePickerComponent} from "../../shared/components/gallery-image-picker/gallery-image-picker.component";
import {MatAnchor, MatButton, MatMiniFabButton} from "@angular/material/button";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {MatInput} from "@angular/material/input";
import {MatOption} from "@angular/material/autocomplete";
import {MatSelect} from "@angular/material/select";
import {BreadcrumbComponent} from "../../shared/components/breadcrumb/breadcrumb.component";
import {GalleryImageViewerComponent} from "../../shared/components/gallery-image-viewer/gallery-image-viewer.component";
import {MatCheckbox} from "@angular/material/checkbox";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import {MatTooltip} from "@angular/material/tooltip";
import {NgxPaginationModule} from "ngx-pagination";
import {NoContentComponent} from "../../shared/components/no-content/no-content.component";
import {PageLoaderComponent} from "../../shared/components/page-loader/page-loader.component";
import {AllPaymentLinkHistoryComponent} from "./all-payment-link-history/all-payment-link-history.component";


@NgModule({
  declarations: [
    AddPaymentLinkComponent,
    AllPaymentLinkComponent,
    AllPaymentLinkHistoryComponent
  ],
  imports: [
    CommonModule,
    PaymentLinkRoutingModule,
    DigitOnlyModule,
    FormsModule,
    GalleryImagePickerComponent,
    MatButton,
    MatError,
    MatFormField,
    MatIcon,
    MatInput,
    MatLabel,
    MatOption,
    MatSelect,
    ReactiveFormsModule,
    BreadcrumbComponent,
    GalleryImageViewerComponent,
    MatAnchor,
    MatCheckbox,
    MatMenu,
    MatMenuItem,
    MatMiniFabButton,
    MatTooltip,
    NgxPaginationModule,
    NoContentComponent,
    PageLoaderComponent,
    MatMenuTrigger
  ]
})
export class PaymentLinkModule { }
