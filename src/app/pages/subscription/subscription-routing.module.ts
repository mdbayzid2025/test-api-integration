import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AllSubscriptionComponent} from "./all-subscription/all-subscription.component";

const routes: Routes = [
  {path: '', redirectTo: 'all-subscription', pathMatch: 'full'},
  {path: 'all-subscription', component: AllSubscriptionComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubscriptionRoutingModule { }
