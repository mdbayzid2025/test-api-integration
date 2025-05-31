import {AfterViewInit, Component, inject, OnDestroy, ViewChild} from '@angular/core';
import {adminBaseMixin} from "../../../mixin/admin-base.mixin";
import {AffiliatePaymentReport} from "../../../interfaces/common/affiliate-payment-report.interface";
import {NgForm} from "@angular/forms";
import {MatCheckbox, MatCheckboxChange} from "@angular/material/checkbox";
import {NavBreadcrumb} from "../../../interfaces/core/nav-breadcrumb.interface";
import {debounceTime, distinctUntilChanged, EMPTY,filter, map, Subscription} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {UiService} from "../../../services/core/ui.service";
import {UtilsService} from "../../../services/core/utils.service";
import {ReloadService} from "../../../services/core/reload.service";
import {AffiliatePaymentReportService} from "../../../services/common/affiliate-payment-report.service";
import {switchMap} from "rxjs/operators";
import {Pagination} from "../../../interfaces/core/pagination";
import {FilterData} from "../../../interfaces/gallery/filter-data";
import {ConfirmDialogComponent} from "../../../shared/components/ui/confirm-dialog/confirm-dialog.component";
import {AffiliateReportsService} from "../../../services/common/affiliate-reports.service";
import {AdminService} from "../../../services/common/admin.service";

@Component({
  selector: 'app-affiliate-payment-report-list',
  templateUrl: './affiliate-payment-report-list.component.html',
  styleUrl: './affiliate-payment-report-list.component.scss'
})
export class AffiliatePaymentReportListComponent extends adminBaseMixin(Component) implements  OnDestroy {

  // Store Data
  affiliatePaymentReports: AffiliatePaymentReport[] = [];
  private holdPrevUsers: AffiliatePaymentReport[] = [];


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
    createdAt: 1,
    paymentMethod: 1,
    note: 1,
    dateString: 1,
    affiliate: 1,
    method: 1,
    status: 1,
    image: 1,
  }

  // Search
  @ViewChild('searchForm') private searchForm: NgForm;
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

  isGalleryOpen: boolean = false;
  galleryImages: string[] = [];
  selectedImageIndex: number = 0;

  // Subscriptions
  private subActivateRoute: Subscription;
  private subSearch: Subscription;
  private subReload: Subscription;
  private subDataGetAll: Subscription;
  private subDataDeleteMulti: Subscription;
  private subDataUpdateMulti: Subscription;
  private subscriptions: Subscription[] = [];

  // Inject
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly dialog = inject(MatDialog);
  private readonly uiService = inject(UiService);
  private readonly utilsService = inject(UtilsService);
  private readonly reloadService = inject(ReloadService);
  private readonly affiliatePaymentReportDataService = inject(AffiliatePaymentReportService);
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

    //Base Data
    this.initImageGalleryView();
  }

  /**
   * HTTP REQ HANDLE
   * getAllAffiliateReports()
   * getAllAffiliatePaymentReports()
   * updateMultipleUserById()
   * deleteMultipleUserById()
   */


  private getAllAffiliateReports() {
    const pagination: Pagination = {
      pageSize: Number(this.dataPerPage),
      currentPage: Number(this.currentPage) - 1
    };

    const filterData: FilterData = {
      pagination: pagination,
      filter: {...this.filter,...{affiliate:this.affiliateId,type:this.type,status:'paid',ownerId:this.adminService.getAdminId(),ownerType:'admin'}},
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
          console.log("eee", this.affiliateReport);
        },
        error: err => {
          this.isLoading = false;
          console.log(err)
        }
      })
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


  openGallery(event: MouseEvent, images: string | string[], index: number = 0): void {
    event.stopPropagation();

    // normalize single string into array
    this.galleryImages = Array.isArray(images) ? images : [images];
    this.selectedImageIndex = index;
    this.isGalleryOpen = true;

    this.router.navigate(
      [],
      {
        queryParams: { 'gallery-image-view': true },
        queryParamsHandling: 'merge'
      }
    );
  }


  closeGallery(): void {
    this.isGalleryOpen = false;
    this.router.navigate([], { queryParams: { 'gallery-image-view': null }, queryParamsHandling: 'merge' }).then();
  }

  /**
   * Base Init Methods
   * initImageGalleryView()
   */
  private initImageGalleryView() {
    const subGalleryImageView = this.activatedRoute.queryParamMap.subscribe((qParam) => {
      if (!qParam.get('gallery-image-view')) {
        this.closeGallery();
      }
    });
    this.subscriptions.push(subGalleryImageView);
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

