import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllAdminComponent } from './all-admin/all-admin.component';
import { AddAdminComponent } from './add-admin/add-admin.component';

const routes: Routes = [
  {path: '', redirectTo: 'all-admin', pathMatch: "full"},
  {path: 'all-admin', component: AllAdminComponent},
  {path: 'add-admin', component: AddAdminComponent},
  {path: 'edit-admin/:id', component: AddAdminComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
