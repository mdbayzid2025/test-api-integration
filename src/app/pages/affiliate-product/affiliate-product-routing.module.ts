import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AddAffiliateProductComponent} from "./add-affiliate-product/add-affiliate-product.component";
import {AllAffiliateProductComponent} from "./all-affiliate-product/all-affiliate-product.component";

const routes: Routes = [
  {path:'all-affiliate-product',component:AllAffiliateProductComponent},
  {path:'add-affiliate-product',component:AddAffiliateProductComponent},
  {path:'edit-affiliate-product/:id',component:AddAffiliateProductComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AffiliateProductRoutingModule { }
