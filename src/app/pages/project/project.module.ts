import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ProjectRoutingModule} from './project-routing.module';
import {AddProjectComponent} from './add-project/add-project.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {DigitOnlyModule} from '@uiowa/digit-only';
import {AllProjectComponent} from './all-project/all-project.component';
import {MatMenuModule} from '@angular/material/menu';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {NgxPaginationModule} from 'ngx-pagination';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import { ViewAllProjectDataComponent } from './view-all-project-data/view-all-project-data.component';
import { AllPendingProjectComponent } from './all-pending-project/all-pending-project.component';
import {BreadcrumbComponent} from '../../shared/components/breadcrumb/breadcrumb.component';
import {PageLoaderComponent} from '../../shared/components/page-loader/page-loader.component';
import {NoContentComponent} from '../../shared/components/no-content/no-content.component';
import {AddBlacklistProjectComponent} from './add-blacklist-project/add-blacklist-project.component';
import {OutSideClickModule} from '../../shared/directives/out-side-click/out-side-click.module';


@NgModule({
  declarations: [
    AllProjectComponent,
    AddProjectComponent,
    ViewAllProjectDataComponent,
    AllPendingProjectComponent,
    AddBlacklistProjectComponent
  ],
  imports: [
    CommonModule,
    ProjectRoutingModule,
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
    MatCheckboxModule,
    NgxPaginationModule,
    MatTooltipModule,
    PageLoaderComponent,
    NoContentComponent,
    MatDatepickerModule,
    MatNativeDateModule,
    OutSideClickModule
  ]
})
export class ProjectModule {
}
