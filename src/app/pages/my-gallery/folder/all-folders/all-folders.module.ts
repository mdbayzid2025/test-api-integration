import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AllFoldersRoutingModule} from './all-folders-routing.module';
import {AllFoldersComponent} from './all-folders.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {PaginationComponent} from '../../../../shared/components/pagination/pagination.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatTooltipModule} from '@angular/material/tooltip';
import {LimitTextPipe} from '../../../../shared/pipes/limit-text.pipe';
import {MatMenuModule} from '@angular/material/menu';
import {NoContentComponent} from '../../../../shared/components/no-content/no-content.component';
import {PageLoaderComponent} from '../../../../shared/components/page-loader/page-loader.component';
import {
  GalleryImageViewerComponent
} from "../../../../shared/components/gallery-image-viewer/gallery-image-viewer.component";



@NgModule({
  declarations: [
    AllFoldersComponent
  ],
  imports: [
    CommonModule,
    AllFoldersRoutingModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
    PaginationComponent,
    MatCheckboxModule,
    MatTooltipModule,
    LimitTextPipe,
    MatMenuModule,
    NoContentComponent,
    PageLoaderComponent,
    GalleryImageViewerComponent,
  ]
})
export class AllFoldersModule {
}
