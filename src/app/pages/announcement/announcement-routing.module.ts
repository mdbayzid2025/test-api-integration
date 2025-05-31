import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllAnnouncementComponent } from './all-announcement/all-announcement.component';
import { AddAnnouncementComponent } from './add-announcement/add-announcement.component';

const routes: Routes = [
  {path: '', redirectTo: 'all-announcement', pathMatch: "full"},
  {path: 'all-announcement', component: AllAnnouncementComponent},
  {path: 'add-announcement', component: AddAnnouncementComponent},
  {path: 'edit-announcement/:id', component: AddAnnouncementComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnnouncementRoutingModule { }
