import {AfterViewInit, Component, inject, OnDestroy, ViewChild} from '@angular/core';
import {DataTableSelectionBase} from "../../../mixin/data-table-select-base.mixin";
import {adminBaseMixin} from "../../../mixin/admin-base.mixin";
import {NgForm} from "@angular/forms";
import {Shop} from "../../../interfaces/common/shop.interface";
import {Select} from "../../../interfaces/core/select";
import {DOMAIN_TYPES, SHOP_TYPES} from "../../../core/utils/app-data";
import {NavBreadcrumb} from "../../../interfaces/core/nav-breadcrumb.interface";
import {debounceTime, distinctUntilChanged, EMPTY, map, Subscription, switchMap, filter} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {ThemeService} from "../../../services/common/theme.service";
import {MatDialog} from "@angular/material/dialog";
import {UiService} from "../../../services/core/ui.service";
import {ReloadService} from "../../../services/core/reload.service";
import {ShopService} from "../../../services/common/shop.service";
import {WebsiteBuildService} from "../../../services/common/website-build.service";
import {Clipboard} from "@angular/cdk/clipboard";
import {VendorService} from "../../../services/common/vendor.service";
import {Pagination} from "../../../interfaces/core/pagination";
import {FilterData} from "../../../interfaces/gallery/filter-data";
import {
  ConfirmInputDialogComponent
} from "../../../shared/components/ui/confirm-input-dialog/confirm-input-dialog.component";
import {ConfirmDialogComponent} from "../../../shared/components/ui/confirm-dialog/confirm-dialog.component";
import {
  WebsiteThemeChangeDialogComponent
} from "../../../shared/dialog-view/website-theme-change-dialog/website-theme-change-dialog.component";
import {DatePipe} from "@angular/common";
import {
  TableDetailsDialogComponent
} from "../../../shared/dialog-view/table-details-dialog/table-details-dialog.component";
import {
  WebsiteUpdateDialogComponent
} from "../../../shared/dialog-view/website-update-dialog/website-update-dialog.component";
import {NoteDialogComponent} from "../../../shared/dialog-view/note-dialog/note-dialog.component";

@Component({
  selector: 'app-shop-report',
  templateUrl: './shop-report.component.html',
  styleUrl: './shop-report.component.scss'
})
export class ShopReportComponent extends DataTableSelectionBase(adminBaseMixin(Component)) implements AfterViewInit, OnDestroy {

  // Decorator
  @ViewChild('searchForm') private searchForm: NgForm;

  // Store Data
  override allTableData: Shop[] = [];
  private holdPrevUsers: Shop[] = [];
  shopTypes: Select[] = SHOP_TYPES;
  domainTypes: Select[] = DOMAIN_TYPES;
  themes: any[] = [];
  isGalleryOpen: boolean = false;
  galleryImages: string[] = [];
  selectedImageIndex: number = 0;
  shopStatement: any;
  storedThemes: any[] = [];

  // Pagination
  currentPage = 1;
  totalData = 0;
  dataPerPage = 100;
  totalDataStore = 0;

  // Filter
  filter: any = null;
  private readonly select: any = {
    theme: 1,
    slug: 1,
    users: 1,
    subDomain: 1,
    websiteName: 1,
    domain: 1,
    domainType: 1,
    port: 1,
    phoneNo: 1,
    email: 1,
    package: 1,
    dateString: 1,
    owner: 1,
    clientNotes: 1,
    buildStatus: 1,
    paymentStatus: 1,
    startDate: 1,
    createdAt: 1,
    status: 1,
    shopType: 1,
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
  activeFilter7: number = null;
  activeFilter8: number = null;

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


  // Inject
  private readonly router = inject(Router);
  private readonly themeDataService = inject(ThemeService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly dialog = inject(MatDialog);
  private readonly uiService = inject(UiService);
  private readonly reloadService = inject(ReloadService);
  private readonly shopService = inject(ShopService);
  private readonly websiteBuildService = inject(WebsiteBuildService);
  private readonly clipboard = inject(Clipboard);
  private readonly vendorService = inject(VendorService);


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

    // Base Data
    this.getShopDashboardStats();
    this.getAllTheme()
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
        if (this.allTableData && this.allTableData.length) {
          this.allTableData.forEach((m, i) => {
            this.allTableData[i].remainingSubDay = this.getRemainingDays(this.allTableData[i].startDate, 30)
          });
        }
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
              this.allTableData[i].remainingSubDay = this.getRemainingDays(this.allTableData[i].startDate, 30)
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

  private getShopDashboardStats() {
    this.shopService.getShopDashboardStats()
      .subscribe({
        next: res => {
          if (res.success) {
            this.shopStatement = res.data;

          }
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

  private renewMultipleShop(data?: any) {
    this.subDataUpdateMulti = this.shopService.renewMultipleShop(this.selectedIds, data)
      .subscribe({
        next: res => {
          if (res.success) {
            this.selectedIds = [];
            this.checkAndUpdateSelect();
            this.reloadService.needRefreshData$();
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

  private getAllTheme() {

    const select = {
      name: 1,
      themeStatus: 1,
      reference: 1,
      version: 1,
    }
    const filterData: FilterData = {
      pagination: null,
      filter: null,
      select: select,
      sort: {createdAt: -1}
    }

    this.subDataGetAll = this.themeDataService.getAllTheme(filterData, null)
      .subscribe({
        next: res => {
          this.themes = res.data;
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
      case 'shopType': {
        this.filter = {...this.filter, ...{'shopType': value}};
        this.activeFilter6 = index;
        break;
      }
      case 'domainTypes': {
        this.filter = {...this.filter, ...{'domainType': value}};
        this.activeFilter7 = index;
        break;
      }
      case 'theme': {
        this.filter = {...this.filter, ...{'theme.name': value}};
        this.activeFilter8 = index;
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
    this.activeFilter7 = null;
    this.activeFilter8 = null;
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
      // if (data.domainType !== 'sub-domain') {
      //   this.uiService.message('Warning! This website hosted in main domain. Please contact with Developer', 'warn');
      //   return;
      // }
      const dialogRef = this.dialog.open(ConfirmInputDialogComponent, {
        maxWidth: '400px',
        data: {
          title: 'Confirm Delete?',
          info: {
            name: data.websiteName,
            matchValue: data.domain ?? data.subDomain
          },
          message: 'Please enter name the name domain name for delete.'
        }
      });
      dialogRef.afterClosed().subscribe(dialogResult => {
        if (dialogResult) {
          const mData = {
            shop: data._id,
            needUserDelete: true,
            needWebsiteDelete: true,
            needDataDelete: true,
          }
          this.deleteShop(mData);
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
    } else if (type === 'renew') {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        maxWidth: '400px',
        data: {
          title: 'Confirm Renew',
          message: 'Are you sure you want renew this shop?'
        }
      });
      dialogRef.afterClosed().subscribe(dialogResult => {
        if (dialogResult) {
          this.renewMultipleShop(data);
        }
      });
    }
  }


  openWebsiteThemeChangeDialog(data: any): void {
    const dialogRef = this.dialog.open(WebsiteThemeChangeDialogComponent, {
      maxWidth: '600px',
      width: '95%',
      data: data,
      disableClose: false
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      this.reloadService.needRefreshData$();
    });
  }

  transformData(originalData: any, datePipe: DatePipe): any {
    return {
      _id: originalData._id.$oid,
      websiteName: originalData.websiteName,
      slug: originalData.slug,
      subDomain: originalData.subDomain,
      port: originalData.port,
      theme_name: originalData.theme.name,
      theme_category: originalData.theme.category,
      theme_subCategory: originalData.theme.subCategory,
      theme_version: originalData.theme.version,
      dateString: originalData.dateString,
      username: originalData.users[0].username,
      role: originalData.users[0].role,
      buildStatus: originalData.buildStatus,
      createdAt: datePipe.transform(originalData.createdAt, 'yyyy-MM-dd'),
      updatedAt: datePipe.transform(originalData.updatedAt, 'yyyy-MM-dd'),
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
    this.clipboard.copy(text);
    this.uiService.message('Text copied successfully.', 'success');
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

  getRemainingDays(startDateStr, durationDays) {
    const startDate = new Date(startDateStr);
    const expiryDate: any = new Date(startDate);
    expiryDate.setDate(startDate.getDate() + durationDays);

    const today: any = new Date();
    // Clear time for accurate day difference
    today.setHours(0, 0, 0, 0);
    expiryDate.setHours(0, 0, 0, 0);

    const diffTime = expiryDate - today;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  }

  adminLoginAsVendor(vendorId: any) {

    const data = {
      identifier: vendorId
    }

    this.vendorService.adminLoginAsVendor(data)
      .subscribe({
        next: async res => {

          if (res.success && res.token) {
            const vendorPanelURL = `https://admin.saleecom.com/login?token=${res.token}`;
            window.open(vendorPanelURL, '_blank');
          } else {

            this.uiService.message('Failed to login as vendor', 'wrong');
          }
        },
        error: err => {
          this.uiService.message(err?.error?.message[0], 'wrong');
          console.log(err)
        }
      })


  }

  openNoteDialog(id: any) {
    this.dialog.open(NoteDialogComponent, {
      width: '600px',
      data: id
    });
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
}
