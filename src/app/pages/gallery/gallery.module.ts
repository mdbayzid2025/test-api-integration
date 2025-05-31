import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {GalleryRoutingModule} from './gallery-routing.module';
import {NgxDropzoneModule} from "ngx-dropzone";
import {NgxPaginationModule} from "ngx-pagination";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {DigitOnlyModule} from "@uiowa/digit-only";
import {MaterialModule} from "../../material/material.module";
import {AllImagesDialogComponent} from "./image/all-images-dialog/all-images-dialog.component";
import {AllImagesComponent} from "./image/all-images/all-images.component";
import {AllFoldersComponent} from "./folder/all-folders/all-folders.component";
import {UploadImageComponent} from "./image/upload-image/upload-image.component";
import {AddFolderComponent} from "./folder/add-folder/add-folder.component";
import {EditImageInfoComponent} from "./image/edit-image-info/edit-image-info.component";
import {EditGalleryInfoComponent} from "./edit-gallery-info/edit-gallery-info.component";
import {BreadcrumbComponent} from "../../shared/components/breadcrumb/breadcrumb.component";
import {NoContentComponent} from "../../shared/components/no-content/no-content.component";
import {PageLoaderComponent} from "../../shared/components/page-loader/page-loader.component";
import {RoleViewPipe} from "../../shared/pipes/role-view.pipe";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {NoWhitespaceModule} from "../../shared/directives/no-whitespace/no-whitespace.module";
import {ImageLoadErrorModule} from "../../shared/directives/image-load/image-load-error.module";


@NgModule({
  declarations: [
    AllFoldersComponent,
    AddFolderComponent,
    AllImagesComponent,
    UploadImageComponent,
    EditImageInfoComponent,
    AllImagesDialogComponent,
    EditGalleryInfoComponent
  ],
    imports: [
        CommonModule,
        GalleryRoutingModule,
        FormsModule,
        MaterialModule,
        NgxPaginationModule,
        DigitOnlyModule,
        NgxDropzoneModule,
        BreadcrumbComponent,
        ReactiveFormsModule,
        NoContentComponent,
        PageLoaderComponent,
        RoleViewPipe,
        MatDatepickerModule,
        NoWhitespaceModule,
        ImageLoadErrorModule,
    ]
})
export class GalleryModule { }
