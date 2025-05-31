import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ThemeRoutingModule} from './theme-routing.module';
import {AllThemeComponent} from './all-theme/all-theme.component';
import {AddThemeComponent} from './add-theme/add-theme.component';
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
import {AllCategoryComponent} from "./category/all-category/all-category.component";
import {AddCategoryComponent} from "./category/add-category/add-category.component";
import {AddSubCategoryComponent} from "./sub-category/add-sub-category/add-sub-category.component";
import {AllSubCategoryComponent} from "./sub-category/all-sub-category/all-sub-category.component";
import {GalleryImagePickerComponent} from '../../shared/components/gallery-image-picker/gallery-image-picker.component';
import {
  TableDetailsDialogComponent
} from '../../shared/dialog-view/table-details-dialog/table-details-dialog.component';
import {GalleryImageViewerComponent} from '../../shared/components/gallery-image-viewer/gallery-image-viewer.component';
import {LimitTextPipe} from '../../shared/pipes/limit-text.pipe';
import {MatDivider} from "@angular/material/divider";
import {MatCard} from "@angular/material/card";


@NgModule({
  declarations: [
    AllThemeComponent,
    AddThemeComponent,
    AllCategoryComponent,
    AddCategoryComponent,
    AddSubCategoryComponent,
    AllSubCategoryComponent
  ],
    imports: [
        CommonModule,
        ThemeRoutingModule,
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
        GalleryImagePickerComponent,
        TableDetailsDialogComponent,
        GalleryImageViewerComponent,
        LimitTextPipe,
        MatDivider,
        MatCard

    ]
})
export class ThemeModule {
}
