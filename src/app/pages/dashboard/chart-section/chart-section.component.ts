import { Component, OnDestroy, OnInit } from '@angular/core';
import { ThemeControllService } from '../../../services/common/theme-controll.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chart-section',
  templateUrl: './chart-section.component.html',
  styleUrl: './chart-section.component.scss'
})
export class ChartSectionComponent  implements OnInit, OnDestroy{
  selectInputStyle = 1;

  //Subscriptions
  private subInputStyle!: Subscription;

  constructor(
    private themeControlService: ThemeControllService
  ) {

  }

  ngOnInit() {
    this.subInputStyle = this.themeControlService.refreshInputStyle$.subscribe((res: any) => {
      this.selectInputStyle = parseInt(res?.value)
    })
  }

  /**
 * NG ON DESTROY
 */

  ngOnDestroy(): void {
    if (this.subInputStyle) {
      this.subInputStyle.unsubscribe();
    }
  }
}
