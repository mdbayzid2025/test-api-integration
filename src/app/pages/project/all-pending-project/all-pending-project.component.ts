import {AfterViewInit, Component, inject, OnDestroy, ViewChild} from '@angular/core';
import {debounceTime, distinctUntilChanged, EMPTY, filter, map, Subscription, switchMap} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {MatCheckbox, MatCheckboxChange} from '@angular/material/checkbox';
import {MatDialog} from '@angular/material/dialog';
import {NgForm} from '@angular/forms';
import * as XLSX from 'xlsx';
import {ViewAllProjectDataComponent} from '../view-all-project-data/view-all-project-data.component';
import {adminBaseMixin} from '../../../mixin/admin-base.mixin';
import {environment} from '../../../../environments/environment';
import {Project} from '../../../interfaces/common/project.interface';
import {NavBreadcrumb} from '../../../interfaces/core/nav-breadcrumb.interface';
import {ProjectService} from '../../../services/common/project.service';
import {UiService} from '../../../services/core/ui.service';
import {UtilsService} from '../../../services/core/utils.service';
import {ReloadService} from '../../../services/core/reload.service';
import {Pagination} from '../../../interfaces/core/pagination';
import {FilterData} from '../../../interfaces/gallery/filter-data';
import {ConfirmDialogComponent} from '../../../shared/components/ui/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-all-pending-project',
  templateUrl: './all-pending-project.component.html',
  styleUrl: './all-pending-project.component.scss'
})
export class AllPendingProjectComponent extends adminBaseMixin(Component) implements AfterViewInit, OnDestroy {

  // Env Base Data
  protected readonly env = environment;

  // Store Data
  private readonly adminBaseUrl: string = environment.adminBaseUrl;
  project: Project;
  projects: Project[] = [];

  private holdPrevProjects: Project[] = [];

  // Pagination
  currentPage = 1;
  totalData = 0;
  dataPerPage = 100;
  totalDataStore = 0;

  // Filter
  filter: any = null;

  // Search
  @ViewChild('searchForm') private searchForm: NgForm;
  private searchProjects: Project[] = [];
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
    {name: 'Dashboard', url: `/${this.adminBaseUrl}/dashboard`},
    {name: 'Black Lists', url: null},
  ];

  // Subscriptions
  private subDataGet: Subscription;
  private subActivateRoute: Subscription;
  private subSearch: Subscription;
  private subReload: Subscription;
  private subDataGetAll: Subscription;
  private subDataDeleteMulti: Subscription;
  private subDataUpdateMulti: Subscription;

  // Inject
  private readonly projectService = inject(ProjectService);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly dialog = inject(MatDialog);
  private readonly uiService = inject(UiService);
  private readonly utilsService = inject(UtilsService);
  private readonly reloadService = inject(ReloadService);


  ngOnInit() {
    // Reload Data
    this.subReload = this.reloadService.refreshData$.subscribe(() => {
      this.getAllProjects();
    })

    // Get Data from Param
    this.subActivateRoute = this.activatedRoute.queryParamMap.subscribe(qParam => {
      if (qParam && qParam.get('page')) {
        this.currentPage = Number(qParam.get('page'));
      } else {
        this.currentPage = 1;
      }
      if (!this.searchQuery) {
        this.getAllProjects();
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
          this.searchProjects = [];
          this.projects = this.holdPrevProjects;
          this.totalData = this.totalDataStore;
          this.searchQuery = null;
          return EMPTY;
        }
        const pagination: Pagination = {
          pageSize: Number(this.dataPerPage),
          currentPage: Number(this.currentPage) - 1
        };
        // Select
        const mSelect = {
          projectId: 1,
          name: 1,
          domain: 1,
          date: 1,
          contact: 1,
          da: 1,
          niche: 1,
          secondaryNiche: 1,
          price: 1,
          linkInsert: 1,
          condition: 1,
          replyStatus: 1,
          dr: 1,
          traffic: 1,
          keywords: 1,
          status: 1,
          url: 1,
          projectName: 1,
        }

        const filterData: FilterData = {
          pagination: pagination,
          filter: {...this.filter, ...{status: 'Pending'}},
          select: mSelect,
          sort: this.sortQuery
        }
        return this.projectService.getAllProjects(filterData, this.searchQuery);
      })
    ).subscribe({
      next: res => {
        this.searchProjects = res.data;
        this.projects = this.searchProjects;
        this.totalData = res.count;

      },
      error: err => {
        console.log(err)
      }
    })
  }

  /**
   * HTTP REQ HANDLE
   * getProjectById()
   * getAllProjects()
   * deleteMultipleProjectById()
   * deleteMultipleProjectById()
   */
  private getProjectById(projestId) {
    this.subDataGet = this.projectService.getProjectById(projestId)
      .subscribe({
        next: res => {
          this.project = res.data;

        },
        error: err => {
          console.log(err)
        }
      })
  }

  private getAllProjects() {
    const pagination: Pagination = {
      pageSize: Number(this.dataPerPage),
      currentPage: Number(this.currentPage) - 1
    };

    const mSelect = {
      projectId: 1,
      name: 1,
      domain: 1,
      date: 1,
      contact: 1,
      da: 1,
      niche: 1,
      secondaryNiche: 1,
      price: 1,
      linkInsert: 1,
      condition: 1,
      replyStatus: 1,
      dr: 1,
      traffic: 1,
      keywords: 1,
      status: 1,
      url: 1,
      projectName: 1,
    }

    const filterData: FilterData = {
      pagination: pagination,
      filter: {...this.filter, ...{status: 'Pending'}},
      select: mSelect,
      sort: this.sortQuery
    }

    // Start Request Time
    this.reqStartTime = new Date();

    this.subDataGetAll = this.projectService.getAllProjects(filterData, this.searchQuery)
      .subscribe({
        next: res => {
          this.projects = res.data;
          if (this.projects && this.projects.length) {
            this.projects.forEach((m, i) => {
              const index = this.selectedIds.findIndex(f => f === m._id);
              this.projects[i].select = index !== -1;
            });

            this.totalData = res.count;
            if (!this.searchQuery) {
              if (this.currentPage === 1) {
                this.holdPrevProjects = res.data;
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

  private deleteMultipleProjectById() {
    this.subDataDeleteMulti = this.projectService.deleteMultipleProjectById(this.selectedIds)
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

  private updateMultipleProjectById(data: any) {
    this.subDataUpdateMulti = this.projectService.updateMultipleProjectById(this.selectedIds, data)
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
    this.projects.forEach(m => {
      if (!m.select) {
        isAllSelect = false;
      }
    });

    this.matCheckbox.checked = isAllSelect;
  }


  onAllSelectChange(event: MatCheckboxChange) {
    const currentPageIds = this.projects.map(m => m._id);
    if (event.checked) {
      this.isIndeterminate = true;
      this.selectedIds = this.utilsService.mergeArrayString(this.selectedIds, currentPageIds)
      this.projects.forEach(m => {
        m.select = true;
      })
    } else {
      this.isIndeterminate = false;
      currentPageIds.forEach(m => {
        this.projects.find(f => f._id === m).select = false;
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
    this.getAllProjects();
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
      this.getAllProjects();
    }
  }

  /**
   * COMPONENT DIALOG VIEW
   * openConfirmDialog()
   */
  public openConfirmDialog(type: 'delete' | 'edit', data?: any) {
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
          this.deleteMultipleProjectById();
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
          this.updateMultipleProjectById(data);
        }
      });

    }

  }

  public openConfirmDialogForViewData(projectId?: any) {
    if (projectId) {
      this.isLoading=true
      this.getProjectById(projectId)
    }
    setTimeout(()=>{
      this.isLoading=false
      const dialogRef = this.dialog.open(ViewAllProjectDataComponent, {
        // maxWidth: '600px',
        data: this.project
      });
      dialogRef.afterClosed().subscribe(dialogResult => {
        if (dialogResult) {


          // this.updateMultipleUserById(data);
        }
      });
    },1500)



  }

  /**
   * PAGINATION CHANGE
   * onPageChanged()
   */
  public onPageChanged(event: any) {
    this.router.navigate([], {queryParams: {page: event}}).then();
  }


  /**
   * Excel Control Methods
   * importExcelData()
   */
  importExcelData(ev: any) {
    this.isLoading = true;
    let workBook = null;
    let jsonData = null;
    const reader = new FileReader();
    const file = ev.target.files[0];


    reader.onload = (event: any) => {
      const data = reader.result;
      workBook = XLSX.read(data, {type: 'binary'});
      jsonData = workBook.SheetNames.reduce((initial: any, name: any) => {
        const sheet = workBook.Sheets[name];
        initial[name] = XLSX.utils.sheet_to_json(sheet);
        return initial;
      }, {});

      // Modify Attributes
      const jsonDataArr: any[] = Object.values(jsonData)[0] as any[];


      // const finalData = jsonDataArr.map(m => {
      //   return {
      //     url: m['Url'],
      //     domain: this.utilsService.getHostnameFromUrl(m['Url']),
      //   }
      // });

      // Upload and Check From DB
      this.updateMultipleProject(jsonDataArr);
    };

    reader.readAsBinaryString(file);
  }

  private updateMultipleProject(data: any[]) {
    // Start Request Time
    this.reqStartTime = new Date();

    this.subDataGetAll = this.projectService.updateMultipleProject(data)
      .subscribe({
        next: res => {
          this.uiService.message(res.message, 'success');
          this.isLoading = false;
          this.getAllProjects()
        },
        error: err => {
          // this.isLoading = false;
          console.log(err)
        }
      })
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

