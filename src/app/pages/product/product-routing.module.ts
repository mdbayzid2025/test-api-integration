import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AllProductComponent} from "./all-product/all-product.component";
import {AddProductComponent} from "./add-product/add-product.component";
import {AddProductNewComponent} from "./add-product-new/add-product-new.component";


const routes: Routes = [
  {path: '', redirectTo: 'all-product', pathMatch: 'full'},
  {path: 'all-product', component: AllProductComponent},
  {path: 'add-product', component: AddProductComponent},
  {path: 'add-product1', component: AddProductNewComponent},
  {path: 'edit/:id', component: AddProductComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductRoutingModule { }
