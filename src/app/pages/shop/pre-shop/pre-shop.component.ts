import {AfterViewInit, Component, inject, OnDestroy, ViewChild} from '@angular/core';
import {DataTableSelectionBase} from "../../../mixin/data-table-select-base.mixin";
import {adminBaseMixin} from "../../../mixin/admin-base.mixin";
import {NgForm} from "@angular/forms";
import {Select} from "../../../interfaces/core/select";
import {DATA_Payment, DATA_STATUS, THEME_CATEGORIES} from "../../../core/utils/app-data";
import {NavBreadcrumb} from "../../../interfaces/core/nav-breadcrumb.interface";
import {debounceTime, distinctUntilChanged, EMPTY, filter, map, Subscription, switchMap} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {UiService} from "../../../services/core/ui.service";
import {ReloadService} from "../../../services/core/reload.service";
import {WebsiteBuildService} from "../../../services/common/website-build.service";
import {Clipboard} from "@angular/cdk/clipboard";
import {Pagination} from "../../../interfaces/core/pagination";
import {FilterData} from "../../../interfaces/gallery/filter-data";
import {
  ConfirmInputDialogComponent
} from "../../../shared/components/ui/confirm-input-dialog/confirm-input-dialog.component";
import {ConfirmDialogComponent} from "../../../shared/components/ui/confirm-dialog/confirm-dialog.component";
import {DatePipe} from "@angular/common";
import {
  TableDetailsDialogComponent
} from "../../../shared/dialog-view/table-details-dialog/table-details-dialog.component";
import {
  WebsiteUpdateDialogComponent
} from "../../../shared/dialog-view/website-update-dialog/website-update-dialog.component";
import {PreShop} from "../../../interfaces/common/pre-shop.interface";
import {PreShopService} from "../../../services/common/pre-shop.service";

@Component({
  selector: 'app-pre-shop',
  templateUrl: './pre-shop.component.html',
  styleUrl: './pre-shop.component.scss'
})
export class PreShopComponent extends DataTableSelectionBase(adminBaseMixin(Component)) implements AfterViewInit, OnDestroy {

  // Decorator
  @ViewChild('searchForm') private searchForm: NgForm;

  // Store Data
  override allTableData: PreShop[] = [];
  private holdPrevUsers: PreShop[] = [];
  // dataStatus: Select[] = DATA_STATUS;
  dataStatus: Select[] = DATA_Payment;
  isGalleryOpen: boolean = false;
  galleryImages: string[] = [];
  selectedImageIndex: number = 0;
  isPopupVisible = false;
  paymentMethod='bkash';
  paymentRefId: any;
  paymentStatus = 'paid';
  phoneNo: string;

  // Pagination
  currentPage = 1;
  totalData = 0;
  dataPerPage = 100;
  totalDataStore = 0;

  // Filter
  filter: any = null;
  private readonly select: any = {
    theme: 1,
    phoneNo: 1,
    amount: 1,
    paymentMethod: 1,
    paymentRefId: 1,
    users: 1,
    subDomain: 1,
    websiteName: 1,
    domain: 1,
    email: 1,
    port: 1,
    package: 1,
    dateString: 1,
    owner: 1,
    buildStatus: 1,
    paymentStatus: 1,
    updatedAt: 1,
    createdAt: 1,
    status: 1,
  }

  // Search
  private searchUsers: any[] = [];
  searchQuery = null;

  // Sort
  private sortQuery = {createdAt: -1};

  // Loading Control
  isLoading: boolean = true;
  private reqStartTime: Date = null;
  private reqEndTime: Date = null;

  // Active Data Store
  activeSortName: string = null;
  activeSort: number = null;
  activeFilter1: number = null;
  activeFilter2: number = null;
  activeFilter6: number = null;

  // Nav Data Breadcrumb
  navArray: NavBreadcrumb[] = [
    {name: 'Dashboard', url: `/dashboard`},
    {name: 'All Shop', url: null},
  ];

  // Subscriptions
  private subActivateRoute: Subscription;
  private subSearch: Subscription;
  private subReload: Subscription;
  private subDataGetAll: Subscription;
  private subDataDeleteMulti: Subscription;
  private subDataUpdateMulti: Subscription;
  private subGalleryImageView: Subscription;
  private sendSms: Subscription;

  // Inject
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly dialog = inject(MatDialog);
  private readonly uiService = inject(UiService);
  private readonly reloadService = inject(ReloadService);
  private readonly shopService = inject(PreShopService);
  private readonly websiteBuildService = inject(WebsiteBuildService);
  private readonly clipboard = inject(Clipboard);

  ngOnInit() {
    // Reload Data
    this.subReload = this.reloadService.refreshData$.subscribe(() => {
      this.getAllShop();
    });

    // Get Data from Param
    this.subActivateRoute = this.activatedRoute.queryParamMap.subscribe(qParam => {
      if (qParam && qParam.get('page')) {
        this.currentPage = Number(qParam.get('page'));
      } else {
        this.currentPage = 1;
      }
      if (!this.searchQuery) {
        this.getAllShop();
      }
    });

    // Gallery Image View handle
    this.subGalleryImageView = this.activatedRoute.queryParamMap.subscribe((qParam) => {
      if (!qParam.get('gallery-image-view')) {
        this.closeGallery();
      }
    });
  }

  ngAfterViewInit(): void {
    const formValue = this.searchForm.valueChanges;

    this.subSearch = formValue.pipe(
      map((t: any) => t['searchTerm']),
      filter(() => this.searchForm.valid),
      debounceTime(200),
      distinctUntilChanged(),
      switchMap(data => {
        this.searchQuery = data;
        // Reset Pagination
        this.currentPage = 1;
        this.router.navigate([], {queryParams: {page: this.currentPage}}).then();
        if (this.searchQuery === '' || this.searchQuery === null) {
          this.searchUsers = [];
          this.allTableData = this.holdPrevUsers;
          this.totalData = this.totalDataStore;
          this.searchQuery = null;
          return EMPTY;
        }
        const pagination: Pagination = {
          pageSize: Number(this.dataPerPage),
          currentPage: Number(this.currentPage) - 1
        };

        const filterData: FilterData = {
          pagination: pagination,
          filter: this.filter,
          select: this.select,
          sort: this.sortQuery
        }
        return this.shopService.getAllShop(filterData, this.searchQuery);
      })
    ).subscribe({
      next: res => {
        this.searchUsers = res.data;
        this.allTableData = this.searchUsers;
        this.totalData = res.count;
      },
      error: err => {
        console.log(err)
      }
    })
  }

  /**
   * HTTP REQ HANDLE
   * getAllUsers()
   * deleteMultipleUserById()
   * updateMultipleUserById()
   */
  private getAllShop() {
    const pagination: Pagination = {
      pageSize: Number(this.dataPerPage),
      currentPage: Number(this.currentPage) - 1
    };

    const filterData: FilterData = {
      pagination: pagination,
      filter: this.filter,
      select: this.select,
      sort: this.sortQuery
    }

    // Start Request Time
    this.reqStartTime = new Date();

    this.subDataGetAll = this.shopService.getAllShop(filterData, this.searchQuery)
      .subscribe({
        next: res => {
          this.allTableData = res.data;
          if (this.allTableData && this.allTableData.length) {
            this.allTableData.forEach((m, i) => {
              const index = this.selectedIds.findIndex(f => f === m._id);
              this.allTableData[i].select = index !== -1;
            });

            this.totalData = res.count;
            if (!this.searchQuery) {
              if (this.currentPage === 1) {
                this.holdPrevUsers = res.data;
                this.totalDataStore = res.count;
              }
            }

            this.checkSelectionData();
          }

          // Response Time Loader
          this.calculateReqTimeAndHideLoader();
        },
        error: err => {
          console.log(err)
        }
      })
  }

  private versionUpdateByShop(data: any) {
    this.subDataDeleteMulti = this.shopService.versionUpdateByShop(data._id)
      .subscribe({
        next: res => {
          console.log('versionUpdateByShop', res)
          if (res.success) {
            this.uiService.message(res.message, 'success');
            this.openWebsiteUpdateDialog(data);

          } else {
            this.uiService.message(res.message, 'warn')
          }
        },
        error: err => {
          console.log(err)
        }
      })
  }

  private deleteShop(data: any) {
    this.subDataDeleteMulti = this.shopService.deleteShop(data)
      .subscribe({
        next: res => {
          if (res.success) {
            this.selectedIds = [];
            this.uiService.message(res.message, 'success');
            this.checkAndUpdateSelect();
            // fetch Data
            if (this.currentPage > 1) {
              this.router.navigate([], {queryParams: {page: 1}}).then();
            } else {
              this.reloadService.needRefreshData$();
            }
          } else {
            this.uiService.message(res.message, 'warn')
          }
        },
        error: err => {
          console.log(err)
        }
      })
  }
  private deleteMultipleUserById() {
    this.subDataDeleteMulti = this.shopService.deleteMultiplePreShopById(this.selectedIds)
      .subscribe({
        next: res => {
          if (res.success) {
            this.selectedIds = [];
            this.uiService.message(res.message, 'success');
            this.checkAndUpdateSelect();
            // fetch Data
            if (this.currentPage > 1) {
              this.router.navigate([], { queryParams: { page: 1 } }).then();
            } else {
              this.reloadService.needRefreshData$();
            }
          } else {
            this.uiService.message(res.message, 'warn')
          }
        },
        error: err => {
          console.log(err)
        }
      })
  }

  private draftShopAndDeleteWebsite(data: { shop: string, vendor: string }) {
    // this.subDataDeleteMulti = this.websiteBuildService.draftShopAndDeleteWebsite(data)
    //   .subscribe({
    //     next: res => {
    //       if (res.success) {
    //         this.selectedIds = [];
    //         this.uiService.message(res.message, 'success');
    //         this.checkAndUpdateSelect();
    //         // fetch Data
    //         if (this.currentPage > 1) {
    //           this.router.navigate([], {queryParams: {page: 1}}).then();
    //         } else {
    //           this.reloadService.needRefreshData$();
    //         }
    //       } else {
    //         this.uiService.message(res.message, 'warn')
    //       }
    //     },
    //     error: err => {
    //       console.log(err)
    //     }
    //   })
  }

  private updateMultipleShopById(data: any) {
    this.subDataUpdateMulti = this.shopService.updateMultipleShopById(this.selectedIds, data)
      .subscribe({
        next: res => {
          if (res.success) {
            this.selectedIds = [];
            this.checkAndUpdateSelect();
            this.reloadService.needRefreshData$();
            this.paymentMethod = null;
            this.paymentRefId = null;
            this.paymentStatus = null;
            this.uiService.message(res.message, 'success');
          } else {
            this.uiService.message(res.message, 'wrong')
          }
        },
        error: err => {
          console.log(err)
        }
      })
  }

  /**
   * Request Time Calculate and Loader Logic
   * calculateReqTimeAndHideLoader()
   */
  private calculateReqTimeAndHideLoader() {
    // Response Time Loader
    this.reqEndTime = new Date;
    const totalReqTimeInSec = (this.reqEndTime.getTime() - this.reqStartTime.getTime()) / 1000;
    if (totalReqTimeInSec < 1) {
      setTimeout(() => {
        this.isLoading = false;
      }, 500)
    } else {
      this.isLoading = false;
    }
  }

  /**
   * Filter & Sort Methods
   * sortData()
   * filterData()
   */
  sortData(query: any, type: number, name: string) {
    this.sortQuery = query;
    this.activeSort = type;
    this.activeSortName = name;
    this.getAllShop();
  }

  filterData(value: any, index: number, type: string) {
    switch (type) {
      case 'status': {
        this.filter = {...this.filter, ...{'paymentStatus': value}};
        this.activeFilter6 = index;
        break;
      }
      default: {
        break;
      }
    }
    // Re fetch Data
    if (this.currentPage > 1) {
      this.router.navigate([], {queryParams: {page: 1}});
    } else {
      this.getAllShop();
    }
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
    this.activeFilter6 = null;
    this.sortQuery = {createdAt: -1};
    this.filter = null;
    // Re fetch Data
    if (this.currentPage > 1) {
      this.router.navigate([], {queryParams: {page: 1}}).then();
    } else {
      this.getAllShop();
    }
  }

  /**
   * COMPONENT DIALOG VIEW
   * openConfirmDialog()
   * openDetailsDialog()
   */
  public openConfirmDialog(type: string, data?: any) {
    if (type === 'delete') {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        maxWidth: '400px',
        data: {
          title: 'Confirm Delete',
          message: 'Are you sure you want delete this data?'
        }
      });
      dialogRef.afterClosed().subscribe(dialogResult => {
        if (dialogResult) {
          this.deleteMultipleUserById();
        }
      });
    } else if (type === 'version_update') {
      const dialogRef = this.dialog.open(ConfirmInputDialogComponent, {
        maxWidth: '400px',
        data: {
          title: 'Confirm Version Update?',
          info: {
            name: data.websiteName,
            matchValue: data.domain ?? data.subDomain
          },
          message: 'Please enter name the name domain name for version update.'
        }
      });
      dialogRef.afterClosed().subscribe(dialogResult => {
        if (dialogResult) {
          this.versionUpdateByShop(data);
        }
      });
    } else if (type === 'draft') {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        maxWidth: '400px',
        data: {
          title: 'Confirm Draft',
          message: 'Warning! Shop will be draft and website will be removed.'
        }
      });
      dialogRef.afterClosed().subscribe(dialogResult => {
        if (dialogResult) {
          this.draftShopAndDeleteWebsite(data);
        }
      });
    } else if (type === 'edit') {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        maxWidth: '400px',
        data: {
          title: 'Confirm Edit',
          message: 'Are you sure you want edit this data?'
        }
      });
      dialogRef.afterClosed().subscribe(dialogResult => {
        if (dialogResult) {
          this.updateMultipleShopById(data);
        }
      });
    }

    else if (type === 'sms') {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        maxWidth: '400px',
        data: {
          title: 'Confirm Send',
          message: 'Are you sure you want sen message?'
        }
      });
      dialogRef.afterClosed().subscribe(dialogResult => {
        if (dialogResult) {
          this.smsSend(data);
        }
      });
    }
  }

  smsSend(data:any): void {
    this.sendSms= this.shopService.smsSend(data).subscribe({
      next: res => {
      this.uiService.message(res.message,"success")
      },
      error: err => {
        console.log(err);
        this.isLoading = false;
      }
    });
  }


  transformData(originalData: any, datePipe: DatePipe): any {
    return {
      websiteName: originalData.websiteName,
      phoneNo: originalData.phoneNo,
      dateString: originalData.dateString,
      amount: originalData.amount,
      paymentStatus: originalData.paymentStatus,
      paymentMethod: originalData.paymentMethod,
      paymentRefId: originalData.paymentRefId,
    };
  }

  openDetailsDialog(data: any): void {
    const datePipe = new DatePipe('en-US');
    const transformedData = this.transformData(data, datePipe);
    this.dialog.open(TableDetailsDialogComponent, {
      data: {data: transformedData, nestedFieldName: 'name'},
      maxWidth: '800px',
      height: 'auto',
      maxHeight: '90vh'
    });
  }

  /**
   * PAGINATION CHANGE
   * onPageChanged()
   */
  public onPageChanged(event: any) {
    this.router.navigate([], {queryParams: {page: event}}).then();
  }

  /**
   * Gallery Image View
   * openGallery()
   * closeGallery()
   * copyToClipboard()
   */
  openGallery(event: any, images: string[], index?: number): void {
    event.stopPropagation();

    if (index) {
      this.selectedImageIndex = index;
    }
    this.galleryImages = images;
    this.isGalleryOpen = true;
    this.router.navigate([], {queryParams: {'gallery-image-view': true}, queryParamsHandling: 'merge'}).then();
  }

  closeGallery(): void {
    this.isGalleryOpen = false;
    this.router.navigate([], {queryParams: {'gallery-image-view': null}, queryParamsHandling: 'merge'}).then();
  }

  copyToClipboard($event: any, text: any): void {
    $event.stopPropagation();
    const url = `https://www.saleecom.com/website-builder/${text}`
    this.clipboard.copy(url);
    this.uiService.message('Url copied successfully.', 'success');
  }


  openWebsiteUpdateDialog(data: any): void {
    const dialogRef = this.dialog.open(WebsiteUpdateDialogComponent, {
      maxWidth: '600px',
      width: '95%',
      data: data,
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      this.reloadService.needRefreshData$();
    });
  }


  openPopup() {
    this.isPopupVisible = true;
  }

  closePopup() {
    this.isPopupVisible = false;
  }

  savePrices() {
    // Close the popup after saving
    this.isPopupVisible = false;

    const data = {
      paymentMethod: this.paymentMethod,
      paymentRefId: this.paymentRefId,
      paymentStatus: this.paymentStatus,
      phoneNo: this.phoneNo,
    }

    this.updateMultipleShopById(data)
  }

  /**
   * ON Destroy
   */
  ngOnDestroy() {
    this.subActivateRoute?.unsubscribe();
    this.subReload?.unsubscribe();
    this.subSearch?.unsubscribe();
    this.subDataGetAll?.unsubscribe();
    this.subDataDeleteMulti?.unsubscribe();
    this.subDataUpdateMulti?.unsubscribe();
    this.subGalleryImageView?.unsubscribe();
  }

  protected readonly categories = THEME_CATEGORIES;
}
