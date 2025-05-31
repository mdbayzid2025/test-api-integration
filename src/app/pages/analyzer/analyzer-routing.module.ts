import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AllAnalyzerComponent} from './all-analyzer/all-analyzer.component';

const routes: Routes = [
  {path: '', component: AllAnalyzerComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnalyzerRoutingModule {
}
