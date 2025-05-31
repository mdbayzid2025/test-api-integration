import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TutorialRoutingModule } from './tutorial-routing.module';
import {AddTutorialComponent} from "./add-tutorial/add-tutorial.component";
import {BreadcrumbComponent} from "../../shared/components/breadcrumb/breadcrumb.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {GalleryImageViewerComponent} from "../../shared/components/gallery-image-viewer/gallery-image-viewer.component";
import {MatAnchor, MatButton, MatIconButton} from "@angular/material/button";
import {MatCheckbox} from "@angular/material/checkbox";
import {MatIcon} from "@angular/material/icon";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import {MatTooltip} from "@angular/material/tooltip";
import {NgxPaginationModule} from "ngx-pagination";
import {NoContentComponent} from "../../shared/components/no-content/no-content.component";
import {PageLoaderComponent} from "../../shared/components/page-loader/page-loader.component";
import {AllTutorialComponent} from "./all-tutorial/all-tutorial.component";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatOption} from "@angular/material/autocomplete";
import {MatSelect} from "@angular/material/select";
import {GalleryImagePickerComponent} from "../../shared/components/gallery-image-picker/gallery-image-picker.component";


@NgModule({
  declarations: [
    AddTutorialComponent,
AllTutorialComponent
  ],
  imports: [
    CommonModule,
    TutorialRoutingModule,
    BreadcrumbComponent,
    FormsModule,
    GalleryImageViewerComponent,
    MatAnchor,
    MatButton,
    MatCheckbox,
    MatIcon,
    MatIconButton,
    MatMenu,
    MatMenuItem,
    MatTooltip,
    NgxPaginationModule,
    NoContentComponent,
    PageLoaderComponent,
    ReactiveFormsModule,
    MatMenuTrigger,
    ReactiveFormsModule,
    MatError,
    MatFormField,
    MatInput,
    MatLabel,
    MatOption,
    MatSelect,
    GalleryImagePickerComponent,
  ]
})
export class TutorialModule { }
