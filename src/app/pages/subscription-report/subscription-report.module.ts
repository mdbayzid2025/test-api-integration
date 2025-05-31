import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SubscriptionReportRoutingModule } from './subscription-report-routing.module';
import { AllSubscriptionReportComponent } from './all-subscription-report/all-subscription-report.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DigitOnlyModule } from '@uiowa/digit-only';
import { NgxPaginationModule } from 'ngx-pagination';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';
import { NoContentComponent } from '../../shared/components/no-content/no-content.component';
import { PageLoaderComponent } from '../../shared/components/page-loader/page-loader.component';
import { NoWhitespaceModule } from '../../shared/directives/no-whitespace/no-whitespace.module';
import { RoleViewPipe } from '../../shared/pipes/role-view.pipe';
import {GalleryImageViewerComponent} from "../../shared/components/gallery-image-viewer/gallery-image-viewer.component";
import { AllRenewReportComponent } from './all-renew-report/all-renew-report.component';


@NgModule({
  declarations: [
    AllSubscriptionReportComponent,
    AllRenewReportComponent
  ],
    imports: [
        CommonModule,
        SubscriptionReportRoutingModule,
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
    ]
})
export class SubscriptionReportModule { }
