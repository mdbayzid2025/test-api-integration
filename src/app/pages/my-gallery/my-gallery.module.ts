import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MyGalleryRoutingModule } from './my-gallery-routing.module';
import { MyGalleryComponent } from './my-gallery.component';
import {BreadcrumbComponent} from '../../shared/components/breadcrumb/breadcrumb.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MaterialModule} from '../../material/material.module';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {InfiniteScrollDirective} from '../../shared/directives/infinite-scroll.directive';
import { UploadDialogComponent } from './upload-dialog/upload-dialog.component';
import {FilterDropdownComponent} from '../../shared/components/filter-dropdown/filter-dropdown.component';
import {GalleryLoaderComponent} from '../../shared/loader/gallery-loader/gallery-loader.component';


@NgModule({
  declarations: [
    MyGalleryComponent,
    UploadDialogComponent
  ],
  imports: [
    CommonModule,
    MyGalleryRoutingModule,
    BreadcrumbComponent,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MaterialModule,
    MatProgressSpinnerModule,
    InfiniteScrollDirective,
    FilterDropdownComponent,
    GalleryLoaderComponent
  ]
})
export class MyGalleryModule { }
