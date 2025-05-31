import {Component, inject, Input, OnDestroy, OnInit} from '@angular/core';
import {Select} from "../../../interfaces/core/select";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {Subscription} from "rxjs";
import {DatePipe} from "@angular/common";
import {UtilsService} from "../../../services/core/utils.service";
import {MatDatepickerInputEvent, MatDateRangeInput, MatDateRangePicker, MatEndDate} from "@angular/material/datepicker";
import {FilterData} from "../../../interfaces/gallery/filter-data";
import {DashboardService} from "../../../services/common/dashboard.service";
import {OVERVIEW_FILTER} from "../../../core/utils/app-data";
import {MatFormField} from "@angular/material/form-field";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import {MatButton} from "@angular/material/button";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {MatIconModule} from "@angular/material/icon";
import {MaterialModule} from "../../../material/material.module";
import {AdminService} from "../../../services/common/admin.service";

@Component({
  selector: 'app-dashboard-card',
  templateUrl: './dashboard-card.component.html',
  styleUrl: './dashboard-card.component.scss',
  standalone: true,
  providers: [DatePipe],

  imports: [
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,

  ]
})
export class DashboardCardComponent implements OnInit, OnDestroy {


  affiliateId: string;
  type: string;
  // Store Data
  affiliate?: any;
  dashboardData: any;
  defaultFilter: any;
  filter: any;
  protected readonly overviewFilters: Select[] = OVERVIEW_FILTER;

  // Active Filter Data
  selectedOverviewFilter: Select = null;


  // Date Filter
  today = new Date();
  dataFormDateRange = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  // Inject
  private readonly dashboardService = inject(DashboardService);
  private readonly adminService = inject(AdminService);
  private readonly utilsService = inject(UtilsService);

  private readonly datePipe = inject(DatePipe);


  // Subscriptions
  private subGetAffiliateDashboard: Subscription;
  private subActivateRoute: Subscription;

  // Inject
  private readonly activatedRoute = inject(ActivatedRoute);

  ngOnInit() {



    // ParamMap Subscription
    this.subActivateRoute = this.activatedRoute.queryParamMap.subscribe((qParam) => {
      this.affiliateId = qParam.get('affiliate');
      this.type = qParam.get('type');
      if (this.affiliateId &&  this.type) {
        // Default Data & Filter
        this.setDefaultFilter();
        this.getAffiliateDashboardReports();
      }
    });


  }


  /**
   * HTTP Req Handle
   * getLoginAffiliateInfo()
   * getAffiliateDashboardReports()
   */



  private getAffiliateDashboardReports() {

    const filterData: FilterData = {
      pagination: null,
      filter: {...this.filter, ...{affiliate: this.affiliateId,type:this.type,ownerId:this.adminService.getAdminId(),ownerType:'admin'}},

    }
    this.subGetAffiliateDashboard = this.dashboardService.getAllDashboardOrders(filterData, null)
      .subscribe({
        next: res => {
          this.dashboardData = res.data;
        },
        error: err => {
          console.log(err)
        }
      })
  }

  /**
   * Filter
   * setDefaultFilter()
   * endChangeRegDateRange()
   * onFilterChange()
   * isFilterChange()
   * dateFilterTitle()
   * onClearFilter()
   */
  private setDefaultFilter() {
    this.selectedOverviewFilter = this.overviewFilters[0];

    const startDate = this.utilsService.getDateString(new Date());
    const endDate = this.utilsService.getDateString(new Date());

    this.defaultFilter = {dateString: {$gte: startDate, $lte: endDate}};
    this.filter = this.defaultFilter;
  }

  endChangeRegDateRange(event: MatDatepickerInputEvent<any>) {
    if (event.value) {
      const startDate = this.utilsService.getDateString(
        this.dataFormDateRange.value.start
      );
      const endDate = this.utilsService.getDateString(
        this.dataFormDateRange.value.end
      );
      this.filter = {dateString: {$gte: startDate, $lte: endDate}};
      // Re fetch Data
      this.getAffiliateDashboardReports();
    }
  }

  onFilterChange(type: 'overviewFilter', value: string) {
    if (type === 'overviewFilter') {
      this.selectedOverviewFilter = this.overviewFilters.find(f => f.value === value);
      let startDate: string, endDate: string;
      const today = new Date();
      switch (value) {
        case 'today':
          startDate = this.utilsService.getDateString(new Date());
          endDate = this.utilsService.getDateString(new Date());
          this.filter = {dateString: {$gte: startDate, $lte: endDate}};
          break;
        case 'lastDays':
          const yesterday = new Date(today.setDate(today.getDate() - 1));
          startDate = this.utilsService.getDateString(yesterday);
          endDate = this.utilsService.getDateString(yesterday);
          this.filter = {dateString: {$gte: startDate, $lte: endDate}};
          break;
        case 'thisWeek':
          const currentWeekDay = today.getDay(); // Sunday is 0, Monday is 1, and so on.
          const startOfWeek = new Date(today.setDate(today.getDate() - currentWeekDay));
          startDate = this.utilsService.getDateString(startOfWeek);
          endDate = this.utilsService.getDateString(new Date());
          this.filter = {dateString: {$gte: startDate, $lte: endDate}};
          break;

        case 'lastWeek':
          const lastWeekEnd = new Date(today.setDate(today.getDate() - today.getDay() - 1));
          const lastWeekStart = new Date(today.setDate(today.getDate() - 6)); // 6 days before the end of last week.
          startDate = this.utilsService.getDateString(lastWeekStart);
          endDate = this.utilsService.getDateString(lastWeekEnd);
          this.filter = {dateString: {$gte: startDate, $lte: endDate}};
          break;

        case 'last7Days':
          startDate = this.utilsService.getDateString(new Date(today.setDate(today.getDate() - 7)));
          endDate = this.utilsService.getDateString(new Date());
          this.filter = {dateString: {$gte: startDate, $lte: endDate}};
          break;

        case 'last15Days':
          startDate = this.utilsService.getDateString(new Date(today.setDate(today.getDate() - 15)));
          endDate = this.utilsService.getDateString(new Date());
          this.filter = {dateString: {$gte: startDate, $lte: endDate}};
          break;

        case 'last30Days':
          startDate = this.utilsService.getDateString(new Date(today.setDate(today.getDate() - 30)));
          endDate = this.utilsService.getDateString(new Date());
          this.filter = {dateString: {$gte: startDate, $lte: endDate}};
          break;

        case 'thisMonth':
          startDate = this.utilsService.getDateString(new Date(today.getFullYear(), today.getMonth(), 1));
          endDate = this.utilsService.getDateString(today);
          this.filter = {dateString: {$gte: startDate, $lte: endDate}};
          break;

        case 'lastMonth':
          const lastMonth = new Date(today.setMonth(today.getMonth() - 1));
          startDate = this.utilsService.getDateString(new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1));
          endDate = this.utilsService.getDateString(new Date(lastMonth.getFullYear(), lastMonth.getMonth() + 1, 0));
          this.filter = {dateString: {$gte: startDate, $lte: endDate}};
          break;
        default:
          startDate = this.utilsService.getDateString(new Date());
          endDate = this.utilsService.getDateString(new Date());
          this.filter = {dateString: {$gte: startDate, $lte: endDate}};
          break;
      }
    }

    // Fetch Data
    this.getAffiliateDashboardReports();

  }

  get isFilterChange(): boolean {
    if (!this.filter) {
      return false;
    } else {
      return !this.utilsService.checkObjectDeepEqual(this.defaultFilter, this.filter);
    }
  }

  get dateFilterTitle() {
    if (this.dataFormDateRange.get('start').value && this.dataFormDateRange.get('end').value) {
      const startDate = this.datePipe.transform(this.dataFormDateRange.get('start').value, 'mediumDate');
      const endDate = this.datePipe.transform(this.dataFormDateRange.get('end').value, 'mediumDate');
      if (startDate === endDate) {
        return endDate;
      } else {
        return startDate + '-' + endDate;
      }
    } else {
      return 'Filter in Date'
    }
  }

  onClearFilter() {
    this.dataFormDateRange.reset();
    this.setDefaultFilter();
    this.getAffiliateDashboardReports();
  }



  /**
   * ON Destroy
   */

  ngOnDestroy() {
    this.subGetAffiliateDashboard?.unsubscribe();
  }


}
