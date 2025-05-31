import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AnalyzerRoutingModule} from './analyzer-routing.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {DigitOnlyModule} from '@uiowa/digit-only';
import {MatMenuModule} from '@angular/material/menu';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {NgxPaginationModule} from 'ngx-pagination';
import {MatTooltipModule} from '@angular/material/tooltip';
import {AllAnalyzerComponent} from './all-analyzer/all-analyzer.component';
import {BreadcrumbComponent} from '../../shared/components/breadcrumb/breadcrumb.component';
import {PageLoaderComponent} from '../../shared/components/page-loader/page-loader.component';
import {NoContentComponent} from '../../shared/components/no-content/no-content.component';
import {AddProjectDialogModule} from '../../shared/components/add-project-dialog/add-project-dialog.module';
import {NgModelChangeModule} from '../../shared/directives/ng-model-change/ng-model-change.module';


@NgModule({
  declarations: [
    AllAnalyzerComponent,
  ],
  imports: [
    CommonModule,
    AnalyzerRoutingModule,
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
    AddProjectDialogModule,
    NgModelChangeModule
  ]
})
export class AnalyzerModule {
}
