import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllVendorComponent } from './all-vendor/all-vendor.component';
import { AddVendorComponent } from './add-vendor/add-vendor.component';

const routes: Routes = [
  { path: '', redirectTo: 'all-vendor', pathMatch: "full" },
  {path: 'all-vendor', component: AllVendorComponent},
  {path: 'add-vendor', component: AddVendorComponent},
  {path: 'edit-vendor/:id', component: AddVendorComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VendorRoutingModule { }
