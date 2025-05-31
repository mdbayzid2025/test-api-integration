import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllSubscriptionReportComponent } from './all-subscription-report/all-subscription-report.component';
import {AllRenewReportComponent} from "./all-renew-report/all-renew-report.component";

const routes: Routes = [
  {path: '', redirectTo: 'all-subscription-report', pathMatch: 'full'},
  {path: 'all-subscription-report', component: AllSubscriptionReportComponent},
  {path: 'all-renew-report', component: AllRenewReportComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubscriptionReportRoutingModule { }
