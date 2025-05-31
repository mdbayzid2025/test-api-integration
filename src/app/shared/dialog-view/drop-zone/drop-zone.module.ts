import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { DropZoneComponent } from './drop-zone.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';



@NgModule({
  declarations: [
    DropZoneComponent
  ],
  imports: [
    CommonModule,
    NgxDropzoneModule,
    MatIconModule,
    MatButtonModule
  ],
  exports: [
    DropZoneComponent
  ]
})
export class DropZoneModule { }
