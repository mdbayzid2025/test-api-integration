import { AfterViewInit, Component, inject, OnDestroy, ViewChild } from '@angular/core';
import { Theme } from "../../../interfaces/common/theme.interface";
import { NgForm } from "@angular/forms";
import { NavBreadcrumb } from "../../../interfaces/core/nav-breadcrumb.interface";
import { debounceTime, distinctUntilChanged, EMPTY, filter, map, Subscription, switchMap } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
import { Clipboard } from '@angular/cdk/clipboard';
import { MatDialog } from "@angular/material/dialog";
import { UiService } from "../../../services/core/ui.service";
import { ReloadService } from "../../../services/core/reload.service";
import { Pagination } from "../../../interfaces/core/pagination";
import { FilterData } from "../../../interfaces/gallery/filter-data";
import { ConfirmDialogComponent } from "../../../shared/components/ui/confirm-dialog/confirm-dialog.component";
import { ThemeService } from "../../../services/common/theme.service";
import { adminBaseMixin } from "../../../mixin/admin-base.mixin";
import { Select } from "../../../interfaces/core/select";
import { DATA_STATUS } from "../../../core/utils/app-data";
import { TableDetailsDialogComponent } from '../../../shared/dialog-view/table-details-dialog/table-details-dialog.component';
import { DataTableSelectionBase } from '../../../mixin/data-table-select-base.mixin';

@Component({
  selector: 'app-all-theme',
  templateUrl: './all-theme.component.html',
  styleUrl: './all-theme.component.scss'
})
export class AllThemeComponent extends DataTableSelectionBase(adminBaseMixin(Component)) implements AfterViewInit, OnDestroy {

  // Decorator
  @ViewChild('searchForm') private searchForm: NgForm;

  // Store Data
  override allTableData: Theme[] = [];
  private holdPrevUsers: Theme[] = [];
  dataStatus: Select[] = DATA_STATUS;
  isGalleryOpen: boolean = false;
  galleryImages: string[] = [];
  selectedImageIndex: number = 0;

  // Pagination
  currentPage = 1;
  totalData = 0;
  dataPerPage = 100;
  totalDataStore = 0;

  // Filter
  filter: any = null;
  private readonly select: any = {
    name: 1,
    category: 1,
    subCategory: 1,
    sourcePath: 1,
    targetPath: 1,
    images: 1,
    pdf: 1,
    previewLink: 1,
    status: 1,
    gitHubLink: 1,
    forceUpdate: 1,
    version: 1,
    reference: 1,
    updatedAt: 1,
  }

  // Search
  private searchUsers: any[] = [];
  searchQuery = null;

  // Sort
  private sortQuery = { createdAt: -1 };

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
    { name: 'Dashboard', url: `/dashboard` },
    { name: 'All Theme', url: null },
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
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly dialog = inject(MatDialog);
  private readonly uiService = inject(UiService);
  private readonly reloadService = inject(ReloadService);
  private readonly themeDataService = inject(ThemeService);
  private readonly clipboard = inject(Clipboard);

  ngOnInit() {
    // Reload Data
    this.subReload = this.reloadService.refreshData$.subscribe(() => {
      this.getAllUsers();
    });

    // Get Data from Param
    this.subActivateRoute = this.activatedRoute.queryParamMap.subscribe(qParam => {
      if (qParam && qParam.get('page')) {
        this.currentPage = Number(qParam.get('page'));
      } else {
        this.currentPage = 1;
      }
      if (!this.searchQuery) {
        this.getAllUsers();
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
        this.router.navigate([], { queryParams: { page: this.currentPage } }).then();
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
        return this.themeDataService.getAllTheme(filterData, this.searchQuery);
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
  private getAllUsers() {
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

    this.subDataGetAll = this.themeDataService.getAllTheme(filterData, this.searchQuery)
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

  private deleteMultipleUserById() {
    this.subDataDeleteMulti = this.themeDataService.deleteMultipleThemeById(this.selectedIds)
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

  private updateMultipleThemeById(data: any) {
    this.subDataUpdateMulti = this.themeDataService.updateMultipleThemeById(this.selectedIds, data)
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
    this.getAllUsers();
  }

  filterData(value: any, index: number, type: string) {
    switch (type) {
      case 'status': {
        this.filter = { ...this.filter, ...{ 'status': value } };
        this.activeFilter6 = index;
        break;
      }
      default: {
        break;
      }
    }
    // Re fetch Data
    if (this.currentPage > 1) {
      this.router.navigate([], { queryParams: { page: 1 } });
    } else {
      this.getAllUsers();
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
    this.sortQuery = { createdAt: -1 };
    this.filter = null;
    // Re fetch Data
    if (this.currentPage > 1) {
      this.router.navigate([], { queryParams: { page: 1 } }).then();
    } else {
      this.getAllUsers();
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
          this.updateMultipleThemeById(data);
        }
      });
    }
  }

  openDetailsDialog(): void {
    this.dialog.open(TableDetailsDialogComponent, {
      data: { data: this.allTableData[0], nestedFieldName: 'name' },
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
    this.router.navigate([], { queryParams: { page: event } }).then();
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
    this.router.navigate([], { queryParams: { 'gallery-image-view': true }, queryParamsHandling: 'merge' }).then();
  }

  closeGallery(): void {
    this.isGalleryOpen = false;
    this.router.navigate([], { queryParams: { 'gallery-image-view': null }, queryParamsHandling: 'merge' }).then();
  }

  copyToClipboard($event: any, text: any): void {
    $event.stopPropagation();
    this.clipboard.copy(text);
    this.uiService.message('Text copied successfully.', 'success');
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
