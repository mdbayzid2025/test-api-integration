import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { ChartComponent } from './chart/chart.component';
import {NgApexchartsModule} from 'ng-apexcharts';
import {MenuCardComponent} from '../../shared/components/menu-card/menu-card.component';
import { SalesInformationComponent } from './sales-information/sales-information.component';
import { ChartSectionComponent } from './chart-section/chart-section.component';
import { LineChartComponent } from './line-chart/line-chart.component';
import { PieChartComponent } from './pie-chart/pie-chart.component';


@NgModule({
  declarations: [
    DashboardComponent,
    ChartComponent,
    SalesInformationComponent,
    ChartSectionComponent,
    LineChartComponent,
    PieChartComponent,
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    MenuCardComponent,
    NgApexchartsModule,
  ]
})
export class DashboardModule { }
