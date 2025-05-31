import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AffiliateRoutingModule} from './affiliate-routing.module';
import {AddAffiliateComponent} from './add-affiliate/add-affiliate.component';
import {AllAffiliateComponent} from './all-affiliate/all-affiliate.component';
import {BreadcrumbComponent} from "../../shared/components/breadcrumb/breadcrumb.component";
import {DigitOnlyModule} from "@uiowa/digit-only";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {GalleryImagePickerComponent} from "../../shared/components/gallery-image-picker/gallery-image-picker.component";
import {MatAnchor, MatButton, MatButtonModule, MatIconButton, MatMiniFabButton} from "@angular/material/button";
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from "@angular/material/datepicker";
import {MatError, MatFormField, MatHint, MatLabel, MatSuffix} from "@angular/material/form-field";
import {MatIcon, MatIconModule} from "@angular/material/icon";
import {MatInput} from "@angular/material/input";
import {MatOption} from "@angular/material/autocomplete";
import {MatSelect} from "@angular/material/select";
import {NoWhitespaceModule} from "../../shared/directives/no-whitespace/no-whitespace.module";
import {GalleryImageViewerComponent} from "../../shared/components/gallery-image-viewer/gallery-image-viewer.component";
import {MatCheckbox} from "@angular/material/checkbox";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import {MatTooltip} from "@angular/material/tooltip";
import {NgxPaginationModule} from "ngx-pagination";
import {NoContentComponent} from "../../shared/components/no-content/no-content.component";
import {PageLoaderComponent} from "../../shared/components/page-loader/page-loader.component";
import {
  AffiliatePaymentReportListComponent
} from './affiliate-payment-report-list/affiliate-payment-report-list.component';
import {AffiliateSaleReportComponent} from './affiliate-sale-report/affiliate-sale-report.component';
import {DashboardCardComponent} from "../../shared/components/dashboard-card/dashboard-card.component";
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardImage,
  MatCardModule
} from "@angular/material/card";
import {DropZoneModule} from "../../shared/dialog-view/drop-zone/drop-zone.module";
import {AffiliateRequestComponent} from './affiliate-request/affiliate-request.component';

import {AffiliatePaymentRequestComponent} from './affiliate-payment-request/affiliate-payment-request.component';
import {
  AffiliatePaymentClaimFormComponent
} from './affiliate-payment-request/affiliate-payment-claim-form/affiliate-payment-claim-form.component';


@NgModule({
  declarations: [
    AddAffiliateComponent,
    AllAffiliateComponent,
    AffiliatePaymentReportListComponent,

    AffiliateSaleReportComponent,
    AffiliateRequestComponent,

    AffiliatePaymentRequestComponent,
    AffiliatePaymentClaimFormComponent
  ],
  imports: [
    CommonModule,
    AffiliateRoutingModule,
    BreadcrumbComponent,
    DigitOnlyModule,
    FormsModule,
    GalleryImagePickerComponent,
    MatButton,
    MatDatepicker,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatError,
    MatFormField,
    MatHint,
    MatIcon,
    MatIconButton,
    MatInput,
    MatLabel,
    MatOption,
    MatSelect,
    MatSuffix,
    NoWhitespaceModule,
    ReactiveFormsModule,
    GalleryImageViewerComponent,
    MatAnchor,
    MatCheckbox,
    MatMenu,
    MatMenuItem,
    MatTooltip,
    NgxPaginationModule,
    NoContentComponent,
    PageLoaderComponent,
    MatMenuTrigger,
    MatMiniFabButton,
    DashboardCardComponent,
    MatCard,
    DropZoneModule,
    MatCardActions,
    MatCardHeader,
    MatCardContent,
    MatCardImage,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
  ]
})
export class AffiliateModule {
}
