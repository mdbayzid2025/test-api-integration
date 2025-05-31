import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {UpdateWebsiteComponent} from './update-website.component';

const routes: Routes = [
  {path: '', component: UpdateWebsiteComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UpdateWebsiteRoutingModule {
}
