import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AddPaymentLinkComponent} from "./add-payment-link/add-payment-link.component";
import {AllPaymentLinkComponent} from "./all-payment-link/all-payment-link.component";
import {AllPaymentLinkHistoryComponent} from "./all-payment-link-history/all-payment-link-history.component";

const routes: Routes = [
  {
    path: 'add-payment-link',component:AddPaymentLinkComponent
  },
  {path: 'edit-payment-link/:id', component: AddPaymentLinkComponent},
  {path: 'all-payment-link', component: AllPaymentLinkComponent},
  {path: 'all-payment-link-history', component: AllPaymentLinkHistoryComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentLinkRoutingModule { }
