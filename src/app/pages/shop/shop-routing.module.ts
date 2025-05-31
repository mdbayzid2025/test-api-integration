import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AllShopComponent} from "./all-shop/all-shop.component";
import {AddShopComponent} from "./add-shop/add-shop.component";
import {PreShopComponent} from "./pre-shop/pre-shop.component";
import {ShopReportComponent} from "./shop-report/shop-report.component";


const routes: Routes = [
  {path: '', redirectTo: 'all-shop', pathMatch: 'full'},
  {path: 'all-shop', component: AllShopComponent},
  {path: 'all-shop-report', component: ShopReportComponent},
  {path: 'add-shop', component: AddShopComponent},
  {path: 'all-pre-shop', component: PreShopComponent},
  {path: 'edit/:id', component: AddShopComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShopRoutingModule {
}
