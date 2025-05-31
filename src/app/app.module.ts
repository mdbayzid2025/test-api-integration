import {NgModule} from '@angular/core';
import {BrowserModule, Meta, Title} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {AuthAdminInterceptor} from './auth-interceptor/auth-admin.interceptor';
import { PaymentInstructionDialogComponent } from './shared/dialog-view/payment-instruction-dialog/payment-instruction-dialog.component';
import {MatDialogActions, MatDialogContent, MatDialogModule, MatDialogTitle} from "@angular/material/dialog";
import {ReactiveFormsModule} from "@angular/forms";
import {MatFormField, MatFormFieldModule} from "@angular/material/form-field";
import {MatInput, MatInputModule} from "@angular/material/input";
import {MatButton, MatButtonModule} from "@angular/material/button";

@NgModule({
  declarations: [
    AppComponent,
    // PaymentInstructionDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
  ],
  providers: [
    Title,
    Meta,
    {provide: HTTP_INTERCEPTORS, useClass: AuthAdminInterceptor, multi: true},
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
