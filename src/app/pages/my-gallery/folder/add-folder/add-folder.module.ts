import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AddFolderRoutingModule} from './add-folder-routing.module';
import {AddFolderComponent} from './add-folder.component';
import {MatInputModule} from '@angular/material/input';
import {ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {
  GalleryImagePickerComponent
} from '../../../../shared/components/gallery-image-picker/gallery-image-picker.component';
import {MatIconModule} from '@angular/material/icon';
import {MatOptionModule} from '@angular/material/core';
import {MatSelectModule} from '@angular/material/select';
import {DigitOnlyModule} from '@uiowa/digit-only';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MaterialModule} from '../../../../material/material.module';


@NgModule({
  declarations: [
    AddFolderComponent
  ],
  imports: [
    CommonModule,
    AddFolderRoutingModule,
    DigitOnlyModule,
    GalleryImagePickerComponent,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    MaterialModule,
    ReactiveFormsModule
  ]
})
export class AddFolderModule {
}
