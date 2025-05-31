import { AfterViewInit, Component, inject, OnDestroy, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatCheckbox, MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription, map, filter, debounceTime, distinctUntilChanged, switchMap, EMPTY } from 'rxjs';
import { NavBreadcrumb } from '../../../interfaces/core/nav-breadcrumb.interface';
import { Pagination } from '../../../interfaces/core/pagination';
import { FilterData } from '../../../interfaces/gallery/filter-data';
import { adminBaseMixin } from '../../../mixin/admin-base.mixin';
import { ReloadService } from '../../../services/core/reload.service';
import { UiService } from '../../../services/core/ui.service';
import { UtilsService } from '../../../services/core/utils.service';
import { ConfirmDialogComponent } from '../../../shared/components/ui/confirm-dialog/confirm-dialog.component';
import { AnnouncementService } from '../../../services/common/announcement.service';
import { Announcement } from '../../../interfaces/common/announcement.interface';

@Component({
  selector: 'app-all-announcement',
  templateUrl: './all-announcement.component.html',
  styleUrl: './all-announcement.component.scss'
})
export class AllAnnouncementComponent extends adminBaseMixin(Component) implements AfterViewInit, OnDestroy {

  // Store Data
  announcement: Announcement[] = [];
  private holdPrevUsers: Announcement[] = [];

  // Pagination
  currentPage = 1;
  totalData = 0;
  dataPerPage = 100;
  totalDataStore = 0;

  // Filter
  filter: any = null;
  private readonly select: any = {
    name: 1,
    url: 1,
    description: 1,
    previewLink: 1,
    status: 1,
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
    {name: 'All Announcement', url: null},
  ];

  // Subscriptions
  private subActivateRoute: Subscription;
  private subSearch: Subscription;
  private subReload: Subscription;
  private subDataGetAll: Subscription;
  private subDataDeleteMulti: Subscription;
  private subDataUpdateMulti: Subscription;

  // Inject
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly dialog = inject(MatDialog);
  private readonly uiService = inject(UiService);
  private readonly utilsService = inject(UtilsService);
  private readonly reloadService = inject(ReloadService);
  private readonly announcementService = inject(AnnouncementService);


  ngOnInit() {
    // Reload Data
    this.subReload = this.reloadService.refreshData$.subscribe(() => {
      this.getAllAnnouncement();
    })

    // Get Data from Param
    this.subActivateRoute = this.activatedRoute.queryParamMap.subscribe(qParam => {
      if (qParam && qParam.get('page')) {
        this.currentPage = Number(qParam.get('page'));
      } else {
        this.currentPage = 1;
      }
      if (!this.searchQuery) {
        this.getAllAnnouncement();
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
          this.announcement = this.holdPrevUsers;
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
        return this.announcementService.getAllAnnouncement(filterData, this.searchQuery);
      })
    ).subscribe({
      next: res => {
        this.searchUsers = res.data;
        this.announcement = this.searchUsers;
        this.totalData = res.count;

      },
      error: err => {
        console.log(err)
      }
    })
  }

  /**
   * HTTP REQ HANDLE
   * getAllAnnouncement()
   * deleteMultipleAnnouncementById()
   */
  private getAllAnnouncement() {
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

    this.subDataGetAll = this.announcementService.getAllAnnouncement(filterData, this.searchQuery)
      .subscribe({
        next: res => {
          this.announcement = res.data;
          if (this.announcement && this.announcement.length) {
            this.announcement.forEach((m, i) => {
              const index = this.selectedIds.findIndex(f => f === m._id);
              this.announcement[i].select = index !== -1;
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
          // this.isLoading = false;
          console.log(err)
        }
      })
  }

  private deleteMultipleAnnouncementById() {
    this.subDataDeleteMulti = this.announcementService.deleteMultipleAnnouncementById(this.selectedIds)
      .subscribe({
        next: res => {
          if (res.success) {
            this.selectedIds = [];
            this.uiService.message(res.message, 'success');
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

  private updateMultipleAnnouncementById(data: any) {
    this.subDataUpdateMulti = this.announcementService.updateMultipleAnnouncementById(this.selectedIds, data)
      .subscribe({
        next: res => {
          if (res.success) {
            this.selectedIds = [];
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
   * SELECT LOGIC
   * checkSelectionData()
   * onAllSelectChange()
   * onCheckChange()
   */
  private checkSelectionData() {
    let isAllSelect = true;
    this.announcement.forEach(m => {
      if (!m.select) {
        isAllSelect = false;
      }
    });

    this.matCheckbox.checked = isAllSelect;
  }


  onAllSelectChange(event: MatCheckboxChange) {
    const currentPageIds = this.announcement.map(m => m._id);
    if (event.checked) {
      this.isIndeterminate = true;
      this.selectedIds = this.utilsService.mergeArrayString(this.selectedIds, currentPageIds)
      this.announcement.forEach(m => {
        m.select = true;
      })
    } else {
      this.isIndeterminate = false;
      currentPageIds.forEach(m => {
        this.announcement.find(f => f._id === m).select = false;
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
    this.getAllAnnouncement();
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
      this.getAllAnnouncement();
    }
  }

  /**
   * COMPONENT DIALOG VIEW
   * openConfirmDialog()
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
          this.deleteMultipleAnnouncementById();
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
          this.updateMultipleAnnouncementById(data);
        }
      });

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
