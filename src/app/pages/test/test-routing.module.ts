import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {TestComponent} from './test.component';
import {TwoComponent} from './two/two.component';

const routes: Routes = [
  {
    path: '',
    component: TestComponent
  },
  {
    path: 'two',
    component: TwoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TestRoutingModule { }
