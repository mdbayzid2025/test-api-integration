import { Component, OnDestroy, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { Subscription } from 'rxjs';
import { ThemeControllService } from '../../../services/common/theme-controll.service';
@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss']
})
export class PieChartComponent implements OnInit, OnDestroy {
  selectColor: any;
  pieChart: any;

  //Subscription
  private subColor!: Subscription;
  constructor(
    private themeControlService: ThemeControllService
  ) {
    Chart.register(...registerables);
  }
  ngOnInit(): void {
    this.subColor = this.themeControlService.refreshColor$.subscribe((res) => {
      this.selectColor = res;
      this.pieChart?.destroy();
      this.chartFunctionality();
    });

    this.chartFunctionality();

  }

  chartFunctionality() {
    // Line Chart
    const pieCanvasEle: any = document.getElementById('pie')
    this.pieChart = new Chart(pieCanvasEle.getContext('2d'), {
      type: 'pie',
      data: {
        labels: ['Household', 'Electronics', 'Fashion'],
        datasets: [{
          data: [50, 200, 60],
          backgroundColor: [
            `${this.selectColor && this.selectColor !== undefined ? this.selectColor?.colorRgb5Code : '#dadafc'}`,
            `${this.selectColor && this.selectColor !== undefined ? this.selectColor?.colorHexCode : '#5457cd'}`,
            `${this.selectColor && this.selectColor !== undefined ? this.selectColor?.colorRgb7Code : '#8183f4'}`,
          ],
          hoverOffset: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        resizeDelay: 10,
        plugins: {
          legend: {
            position: "bottom",
            align: "center",
            maxWidth: 100,
            labels: {
              boxWidth: 12,
              boxHeight: 12,
              useBorderRadius: true,
              borderRadius: 1,
              usePointStyle: true,
            }
          },

        }

      }
    });
  }


  /**
 * NG ON DESTROY
 */

  ngOnDestroy(): void {
    if (this.subColor) {
      this.subColor.unsubscribe();
    }
  }

}
