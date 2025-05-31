import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AddPortComponent} from "./add-port/add-port.component";
import {AllPortComponent} from "./all-port/all-port.component";

const routes: Routes = [
  {path: '', redirectTo: 'all-port', pathMatch: 'full'},
  {path: 'all-port', component: AllPortComponent},
  {path: 'add-port', component: AddPortComponent},
  {path: 'edit/:id', component: AddPortComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PortRoutingModule {
}
