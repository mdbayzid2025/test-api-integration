import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SupportRoutingModule} from './support-routing.module';
import {SupportComponent} from './support.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from "../../material/material.module";
import {GalleryImageViewerComponent} from "../../shared/components/gallery-image-viewer/gallery-image-viewer.component";
import {LimitTextPipe} from "../../shared/pipes/limit-text.pipe";
import {NoContentComponent} from "../../shared/components/no-content/no-content.component";
import {PageLoaderComponent} from "../../shared/components/page-loader/page-loader.component";
import {PaginationComponent} from "../../shared/components/pagination/pagination.component";
import {GalleryImagePickerComponent} from "../../shared/components/gallery-image-picker/gallery-image-picker.component";
import {
  TableDetailsDialogComponent
} from "../../shared/dialog-view/table-details-dialog/table-details-dialog.component";
import {DigitOnlyModule} from "@uiowa/digit-only";
import {HtmlEditorComponent} from '../../shared/components/html-editor/html-editor.component';
import {GalleryLoaderComponent} from '../../shared/loader/gallery-loader/gallery-loader.component';
import {InfiniteScrollDirective} from '../../shared/directives/infinite-scroll.directive';
import {SafeHtmlCustomPipe} from '../../shared/pipes/safe-html.pipe';


@NgModule({
  declarations: [
    SupportComponent,
  ],
  imports: [
    CommonModule,
    SupportRoutingModule,
    MaterialModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    FormsModule,
    LimitTextPipe,
    NoContentComponent,
    PageLoaderComponent,
    PaginationComponent,
    GalleryImagePickerComponent,
    TableDetailsDialogComponent,
    GalleryImageViewerComponent,
    LimitTextPipe,
    PaginationComponent,
    DigitOnlyModule,
    HtmlEditorComponent,
    GalleryLoaderComponent,
    InfiniteScrollDirective,
    SafeHtmlCustomPipe,
  ]
})
export class SupportModule {
}
