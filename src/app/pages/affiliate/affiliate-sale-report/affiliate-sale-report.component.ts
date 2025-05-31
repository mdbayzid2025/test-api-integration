import {Component, inject, OnDestroy, ViewChild} from '@angular/core';
import {adminBaseMixin} from "../../../mixin/admin-base.mixin";
import {AffiliatePaymentReport} from "../../../interfaces/common/affiliate-payment-report.interface";
import {NgForm} from "@angular/forms";
import {MatCheckbox, MatCheckboxChange} from "@angular/material/checkbox";
import {NavBreadcrumb} from "../../../interfaces/core/nav-breadcrumb.interface";
import {Subscription} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {UiService} from "../../../services/core/ui.service";
import {UtilsService} from "../../../services/core/utils.service";
import {ReloadService} from "../../../services/core/reload.service";
import {AffiliatePaymentReportService} from "../../../services/common/affiliate-payment-report.service";
import {AffiliateProductService} from "../../../services/common/affiliate-product.service";
import {AffiliateReportsService} from "../../../services/common/affiliate-reports.service";
import {Pagination} from "../../../interfaces/core/pagination";
import {FilterData} from "../../../interfaces/gallery/filter-data";

@Component({
  selector: 'app-affiliate-sale-report',
  templateUrl: './affiliate-sale-report.component.html',
  styleUrl: './affiliate-sale-report.component.scss'
})
export class AffiliateSaleReportComponent extends adminBaseMixin(Component) implements OnDestroy {

  // Store Data
  affiliatePaymentReports: AffiliatePaymentReport[] = [];
  private holdPrevUsers: AffiliatePaymentReport[] = [];

  affiliateSaleReports: any;
  affiliateReport: any;
  // Store Data
  userId: string;
  affiliateId: string;
  type: string;

  // Pagination
  currentPage = 1;
  totalData = 0;
  dataPerPage = 100;
  totalDataStore = 0;
  totalAmount = 0;

  // Filter
  filter: any = null;
  private readonly select: any = {
    amount: 1,
    shopId: 1,
    shop: 1,
    affiliate: 1,
    createdAt: 1,
    paymentMethod: 1,
    note: 1,
    dateString: 1,
    product: 1,
  }

  // Search
  @ViewChild('searchForm') private searchForm: NgForm;
  private searchUsers: any[] = [];
  searchQuery = null;

  // Sort
  private sortQuery = {createdAt: -1};

  // Selected Data
  isIndeterminate: boolean = false;
  selectedIds: string[] = [];
  @ViewChild('matCheckbox') private matCheckbox: MatCheckbox;

  // Loading Control
  isLoading: boolean = true;
  private reqStartTime: Date = null;
  private reqEndTime: Date = null;


  // Active Data Store
  activeSortName: string = null;
  activeSort: number = null;
  activeFilter1: number = null;
  activeFilter2: number = null;

  // Nav Data
  navArray: NavBreadcrumb[] = [
    {name: 'Dashboard', url: `/dashboard`},
    {name: 'All AffiliatePaymentReport', url: null},
  ];

  // Subscriptions
  private subActivateRoute: Subscription;
  private subSearch: Subscription;
  private subReload: Subscription;
  private subDataGetAll: Subscription;
  private subDataDeleteMulti: Subscription;
  private subDataUpdateMulti: Subscription;
  private allReports: Subscription;


  // Inject
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly dialog = inject(MatDialog);
  private readonly uiService = inject(UiService);
  private readonly utilsService = inject(UtilsService);
  private readonly reloadService = inject(ReloadService);
  private readonly affiliatePaymentReportDataService = inject(AffiliatePaymentReportService);
  private readonly affiliateProductService = inject(AffiliateProductService);
  private readonly affiliateReportsService = inject(AffiliateReportsService);


  ngOnInit() {


    // ParamMap Subscription
    this.subActivateRoute = this.activatedRoute.queryParamMap.subscribe((qParam) => {
      this.affiliateId = qParam.get('affiliate');
      this.type = qParam.get('type');
      if (this.affiliateId &&  this.type) {
        this.getAllAffiliateReports();
      }
    });



  }


  /**
   * HTTP REQ HANDLE
   * getAllAffiliatePaymentReports()
   * deleteMultipleUserById()
   * deleteMultipleUserById()
   */

  private getAllAffiliateReports() {
    const pagination: Pagination = {
      pageSize: Number(this.dataPerPage),
      currentPage: Number(this.currentPage) - 1
    };

    const filterData: FilterData = {
      pagination: pagination,
      filter: {...this.filter,...{affiliate:this.affiliateId,type:this.type,ownerId: this.adminService.getAdminId()}},
      select: this.select,
      sort: this.sortQuery
    }

    // Start Request Time
    this.reqStartTime = new Date();

    this.subDataGetAll = this.affiliateReportsService.getAllAffiliateReports(filterData, this.searchQuery)
      .subscribe({
        next: res => {
          this.affiliateReport = res.data;
          this.totalAmount = res.totalAmount;
          this.isLoading = false;



        },
        error: err => {
          this.isLoading = false;
          console.log(err)
        }
      })
  }





  /**
   * SELECT LOGIC
   * checkSelectionData()
   * onAllSelectChange()
   * onCheckChange()
   */


  onAllSelectChange(event: MatCheckboxChange) {
    const currentPageIds = this.affiliatePaymentReports.map(m => m._id);
    if (event.checked) {
      this.isIndeterminate = true;
      this.selectedIds = this.utilsService.mergeArrayString(this.selectedIds, currentPageIds)
      this.affiliatePaymentReports.forEach(m => {
        m.select = true;
      })
    } else {
      this.isIndeterminate = false;
      currentPageIds.forEach(m => {
        this.affiliatePaymentReports.find(f => f._id === m).select = false;
        const i = this.selectedIds.findIndex(f => f === m);
        this.selectedIds.splice(i, 1);
      })
    }
  }

  onCheckChange(event: any, id: string) {
    if (event) {
      this.selectedIds.push(id);
    } else {
      const i = this.selectedIds.findIndex(f => f === id);
      this.selectedIds.splice(i, 1);
    }
  }

  /**
   * Filter & Sort Methods
   * sortData()
   */

  sortData(query: any, type: number, name: string) {
    this.sortQuery = query;
    this.activeSort = type;
    this.activeSortName = name;

  }

  /**
   * Table & Table Methods
   * onClearDataQuery()
   */
  onClearDataQuery() {
    this.activeSort = null;
    this.activeSortName = null;
    this.activeFilter1 = null;
    this.activeFilter2 = null;
    this.sortQuery = {createdAt: -1};
    this.filter = null;
    // Re fetch Data
    if (this.currentPage > 1) {
      this.router.navigate([], {queryParams: {page: 1}}).then();
    } else {

    }
  }


  /**
   * PAGINATION CHANGE
   * onPageChanged()
   */
  public onPageChanged(event: any) {
    this.router.navigate([], {queryParams: {page: event}}).then();
  }

  /**
   * ON DESTROY
   */

  ngOnDestroy() {
    if (this.subActivateRoute) {
      this.subActivateRoute.unsubscribe();
    }

    if (this.subReload) {
      this.subReload.unsubscribe();
    }

    if (this.subSearch) {
      this.subSearch.unsubscribe();
    }
    if (this.subDataGetAll) {
      this.subDataGetAll.unsubscribe();
    }
    if (this.subDataDeleteMulti) {
      this.subDataDeleteMulti.unsubscribe();
    }
    if (this.subDataUpdateMulti) {
      this.subDataUpdateMulti.unsubscribe();
    }
  }
}

