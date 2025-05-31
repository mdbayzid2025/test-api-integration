import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AllAffiliateComponent} from "./all-affiliate/all-affiliate.component";
import {AddAffiliateComponent} from "./add-affiliate/add-affiliate.component";
import {
  AffiliatePaymentReportListComponent
} from "./affiliate-payment-report-list/affiliate-payment-report-list.component";
import {AffiliateSaleReportComponent} from "./affiliate-sale-report/affiliate-sale-report.component";
import {AffiliateRequestComponent} from "./affiliate-request/affiliate-request.component";
import {AllApprovedAffiliateListComponent} from "./all-approved-affiliate-list/all-approved-affiliate-list.component";

import {AffiliatePaymentRequestComponent} from "./affiliate-payment-request/affiliate-payment-request.component";

const routes: Routes = [
  {path:'all-affiliate',component:AllAffiliateComponent},
  {path:'affiliate-request',component:AffiliateRequestComponent},
  {path:'all-approved-affiliate',component:AllApprovedAffiliateListComponent},
  {path:'add-affiliate',component:AddAffiliateComponent},
  {path:'edit-affiliate/:id',component:AddAffiliateComponent},
  {path:'payment-report-list',component:AffiliatePaymentReportListComponent},
  {path:'affiliate-sale-report',component:AffiliateSaleReportComponent},
  {path:'affiliate-payment-request',component:AffiliatePaymentRequestComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AffiliateRoutingModule { }
