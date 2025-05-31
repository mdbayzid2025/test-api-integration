import { Component, OnDestroy, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js'
import { Subscription } from 'rxjs';
import { ThemeControllService } from '../../../services/common/theme-controll.service';
@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss']
})
export class LineChartComponent implements OnInit,OnDestroy {
  selectColor: any;
  barChart: any;

  //Subscriptions
  private subColor!: Subscription;

  constructor(
    private themeControlService: ThemeControllService
  ) {
    Chart.register(...registerables);
    
  }
  ngOnInit(): void {
    this.subColor = this.themeControlService.refreshColor$.subscribe((res) => {
      this.selectColor = res;
      this.barChart?.destroy();
      this.chartFunctionality();
    });

    this.chartFunctionality();
  }


  chartFunctionality() {
    const barCanvasEle: any = document.getElementById('bar')
    this.barChart = new Chart(barCanvasEle.getContext('2d'), {
      type: 'bar',
      data: {
        labels: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'],
        datasets: [
          {
            data: [65, 59, 80, 81, 56, 55, 40],
            label: 'Revenue',
            borderColor: `${this.selectColor && this.selectColor !== undefined ? this.selectColor?.colorHexCode : '#5457cd'}`,
            backgroundColor: `${this.selectColor && this.selectColor !== undefined ? this.selectColor?.colorHexCode : '#5457cd'}`,
            borderRadius: 50,
            pointStyle: "circle",
            categoryPercentage: 0.25,
            barPercentage: 1

          },
          {
            data: [12, 15, 18, 14, 11, 19, 12],
            label: 'Profit',
            borderColor: `${this.selectColor && this.selectColor !== undefined ? this.selectColor?.colorRgb5Code : '#dadafc'}`,
            backgroundColor: `${this.selectColor && this.selectColor !== undefined ? this.selectColor?.colorRgb5Code : '#dadafc'}`,
            borderRadius: 50,
            categoryPercentage: 0.25,
            barPercentage: 1
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,

          },
          x: {
            ticks: {
              color: '#64748b',
            },
            border: {
              color: '#dfe7ef',
            },

          },
        },
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

        },
        layout: {
          padding: 10
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
