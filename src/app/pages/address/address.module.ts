import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AddressRoutingModule} from './address-routing.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgxPaginationModule} from 'ngx-pagination';
import {DigitOnlyModule} from '@uiowa/digit-only';
import {AddDivisionComponent} from './division/add-division/add-division.component';
import {AllDivisionsComponent} from './division/all-divisions/all-divisions.component';
import {AddAreaComponent} from './area/add-area/add-area.component';
import {AllAreaComponent} from './area/all-area/all-area.component';
import {AllZoneComponent} from './zone/all-zone/all-zone.component';
import {AddZoneComponent} from './zone/add-zone/add-zone.component';
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {MatButtonModule} from "@angular/material/button";
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


@NgModule({
  declarations: [
    AddDivisionComponent,
    AllDivisionsComponent,
    AddAreaComponent,
    AllAreaComponent,
    AllZoneComponent,
    AddZoneComponent
  ],
  imports: [
    CommonModule,
    AddressRoutingModule,
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
  ]
})
export class AddressModule { }
