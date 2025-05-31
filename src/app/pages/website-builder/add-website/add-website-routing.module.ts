import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AddWebsiteComponent} from './add-website.component';

const routes: Routes = [
  {path: '', component: AddWebsiteComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddWebsiteRoutingModule {
}
