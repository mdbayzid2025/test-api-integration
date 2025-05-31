import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AllPackageComponent} from "./all-package/all-package.component";
import {AddPackageComponent} from "./add-package/add-package.component";

const routes: Routes = [
  {path: '', redirectTo: 'all-theme', pathMatch: 'full'},
  {path: 'all-package', component: AllPackageComponent},
  {path: 'add-package', component: AddPackageComponent},
  {path: 'edit/:id', component: AddPackageComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PackageRoutingModule { }
