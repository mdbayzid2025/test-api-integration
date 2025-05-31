import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile.component';
import {ReactiveFormsModule} from '@angular/forms';
import {ImageCropperModule} from 'ngx-image-cropper';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {AdminChangePasswordComponent} from './admin-change-password/admin-change-password.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {ImageCropComponent} from '../../shared/components/image-crop/image-crop.component';
import {RoleViewPipe} from '../../shared/pipes/role-view.pipe';


@NgModule({
  declarations: [
    ProfileComponent,
    AdminChangePasswordComponent
  ],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    ReactiveFormsModule,
    ImageCropperModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ImageCropComponent,
    RoleViewPipe
  ]
})
export class ProfileModule { }
