import { AfterViewInit, Component, inject, OnDestroy, ViewChild } from '@angular/core';
import { debounceTime, distinctUntilChanged, EMPTY, filter, map, Subscription, switchMap } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCheckbox, MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { FormControl, FormGroup, NgForm } from '@angular/forms';
import * as XLSX from 'xlsx';
import { ViewAllProjectDataComponent } from '../view-all-project-data/view-all-project-data.component';
import { environment } from '../../../../environments/environment';
import { adminBaseMixin } from '../../../mixin/admin-base.mixin';
import { Project } from '../../../interfaces/common/project.interface';
import { NavBreadcrumb } from '../../../interfaces/core/nav-breadcrumb.interface';
import { ProjectService } from '../../../services/common/project.service';
import { UiService } from '../../../services/core/ui.service';
import { UtilsService } from '../../../services/core/utils.service';
import { ReloadService } from '../../../services/core/reload.service';
import { Pagination } from '../../../interfaces/core/pagination';
import { FilterData } from '../../../interfaces/gallery/filter-data';
import { ConfirmDialogComponent } from '../../../shared/components/ui/confirm-dialog/confirm-dialog.component';
import { MatDatepickerInputEvent } from "@angular/material/datepicker";
import { REPLY_STATUS } from "../../../core/utils/app-data";
import { Select } from "../../../interfaces/core/select";
import { CategoryService } from '../../../services/common/category.service';


@Component({
  selector: 'app-all-project',
  templateUrl: './all-project.component.html',
  styleUrl: './all-project.component.scss',

})
export class AllProjectComponent extends adminBaseMixin(Component) implements AfterViewInit, OnDestroy {

  today = new Date();
  dataFormDateRange = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  baseLink = environment.baseLink;
  // Env Base Data
  protected readonly env = environment;
  showMinMax: boolean = false;

  // Store Data
  private readonly adminBaseUrl: string = environment.adminBaseUrl;
  project: Project;
  projects: Project[] = [];
  replyStatus: Select[] = REPLY_STATUS;
  nicheList: any[] = [];
  private holdPrevProjects: Project[] = [];

  // Pagination
  currentPage = 1;
  totalData = 0;
  dataPerPage = 100;
  totalDataStore = 0;

  // Filter
  filter: any = null;
  daMinRange: number;
  daMaxRange: number;

  // Search
  @ViewChild('searchForm') private searchForm: NgForm;
  private searchProjects: Project[] = [];
  searchQuery = null;

  // Sort
  private sortQuery = { createdAt: -1 };

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
    { name: 'Dashboard', url: `/${this.adminBaseUrl}/dashboard` },
    { name: 'Projects', url: null },
  ];

  // Subscriptions
  private subDataGet: Subscription;
  private subActivateRoute: Subscription;
  private subSearch: Subscription;
  private subReload: Subscription;
  private subDataGetAll: Subscription;
  private subDataGetAll2: Subscription;
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
  private readonly categoryDataService = inject(CategoryService);


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

    // Base Data
    this.getAllCategory();
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
          date: 1,
          dateString: 1,
          projectName: 1,
          contact: 1,
          da: 1,
          niche: 1,
          secondaryNiche: 1,
          replyStatus: 1,
          guestPostPrice: 1,
          linkInsertPrice: 1,
          condition: 1,
          semRushUsTraffic: 1,
          trend: 1,
          mode: 1,
          ip: 1,
          ur: 1,
          dr: 1,
          ahrefsRank: 1,
          domain: 1,
          refDomainsDoFollow: 1,
          refDomainsGovernmental: 1,
          refDomainsEducational: 1,
          refIPs: 1,
          refSubNets: 1,
          linkedDomains: 1,
          totalBacklinks: 1,
          backlinksText: 1,
          backlinksNoFollow: 1,
          backlinksRedirect: 1,
          backlinksImage: 1,
          backlinksFrame: 1,
          backlinksForm: 1,
          backlinksGovernmental: 1,
          backlinksEducational: 1,
          keywordsRankedFor: 1,
          ahrefTraffic: 1,
          trafficDate: 1,

          googleIndex: 1,
          semRushBackLinks: 1,
          semRushSubDomainBacklinks: 1,
          bingIndex: 1,
          semRushRank: 1,

          price: 1,
          linkInsert: 1,
          traffic: 1,
          keywords: 1,
        }

        const filterData: FilterData = {
          pagination: pagination,
          filter: { ...this.filter, ...{ status: 'Confirmed' } },
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

  onSHow: boolean = false;

  filterButtonClick() {
    this.onSHow = !this.onSHow;
  }

  handleShowMinMax(){
    this.showMinMax = true;
  }

  /**
   * HTTP REQ HANDLE
   * getProjectById()
   * getAllProjects()
   * deleteMultipleProjectById()
   * deleteMultipleProjectById()
   */
  private getProjectById(projectId: string) {
    this.isLoading = true;
    this.subDataGet = this.projectService.getProjectById(projectId)
      .subscribe({
        next: res => {
          this.isLoading = false;
          this.project = res.data;
          this.dialog.open(ViewAllProjectDataComponent, {
            // maxWidth: '600px',
            data: this.project
          });
        },
        error: err => {
          this.isLoading = false;
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
      date: 1,
      dateString: 1,
      projectName: 1,
      contact: 1,
      da: 1,
      niche: 1,
      secondaryNiche: 1,
      replyStatus: 1,
      guestPostPrice: 1,
      linkInsertPrice: 1,
      condition: 1,
      semRushUsTraffic: 1,
      trend: 1,
      mode: 1,
      ip: 1,
      ur: 1,
      dr: 1,
      ahrefsRank: 1,
      domain: 1,
      refDomainsDoFollow: 1,
      refDomainsGovernmental: 1,
      refDomainsEducational: 1,
      refIPs: 1,
      refSubNets: 1,
      linkedDomains: 1,
      totalBacklinks: 1,
      backlinksText: 1,
      backlinksNoFollow: 1,
      backlinksRedirect: 1,
      backlinksImage: 1,
      backlinksFrame: 1,
      backlinksForm: 1,
      backlinksGovernmental: 1,
      backlinksEducational: 1,
      keywordsRankedFor: 1,
      ahrefTraffic: 1,
      trafficDate: 1,

      googleIndex: 1,
      semRushBackLinks: 1,
      semRushSubDomainBacklinks: 1,
      bingIndex: 1,
      semRushRank: 1,

      price: 1,
      linkInsert: 1,
      traffic: 1,
      keywords: 1,
    }

    const filterData: FilterData = {
      pagination: pagination,
      filter: { ...this.filter, ...{ status: 'Confirmed' } },
      select: mSelect,
      sort: { date: -1 }
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

  private getAllCategory() {
    const mSelect = {
      name: 1,
    }

    const filterData: FilterData = {
      pagination: null,
      filter: null,
      select: mSelect,
      sort: { name: 1 }
    }

    this.subDataGetAll2 = this.categoryDataService.getAllCategories(filterData, null)
      .subscribe({
        next: res => {
          this.nicheList = res?.data;
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
   * FILTERING
   */
  filterData(value: any, index: number, type: string) {
    switch (type) {
      case 'replyStatus': {
        this.filter = { ...this.filter, ...{ replyStatus: value } };
        this.activeFilter1 = index;
        break;
      }
      case 'category': {
        this.filter = { ...this.filter, ...{ niche: value } };
        this.activeFilter2 = index;
        break;
      }
      case 'da': {
        this.filter = { ...this.filter, ...{ da: {$gte: this.daMinRange, $lte: this.daMaxRange} } };
        // this.activeFilter2 = index;
        this.showMinMax = false;
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
      this.getAllProjects();
    }
  }


  /**
   * EXPORTS TO EXCEL
   * exportToExcel()
   */


  exportToAllExcel() {
    const date = this.utilsService.getDateString(new Date());
    // Select
    const mSelect = {
      projectId: 1,
      name: 1,
      dateString: 1,
      projectName: 1,
      contact: 1,
      da: 1,
      niche: 1,
      secondaryNiche: 1,
      replyStatus: 1,
      guestPostPrice: 1,
      linkInsertPrice: 1,
      condition: 1,
      semRushUsTraffic: 1,
      trend: 1,
      mode: 1,
      ip: 1,
      ur: 1,
      dr: 1,
      ahrefsRank: 1,
      domain: 1,
      refDomainsDoFollow: 1,
      refDomainsGovernmental: 1,
      refDomainsEducational: 1,
      refIPs: 1,
      refSubNets: 1,
      linkedDomains: 1,
      totalBacklinks: 1,
      backlinksText: 1,
      backlinksNoFollow: 1,
      backlinksRedirect: 1,
      backlinksImage: 1,
      backlinksFrame: 1,
      backlinksForm: 1,
      backlinksGovernmental: 1,
      backlinksEducational: 1,
      keywordsRankedFor: 1,
      ahrefTraffic: 1,
      trafficDate: 1,

      googleIndex: 1,
      semRushBackLinks: 1,
      semRushSubDomainBacklinks: 1,
      bingIndex: 1,
      semRushRank: 1,

      price: 1,
      linkInsert: 1,
      traffic: 1,
      keywords: 1,
    }
    let filter = {};

    if (this.selectedIds.length) {
      filter = { _id: { $in: this.selectedIds } };
    } else {
      filter = { ...this.filter, ...{ status: 'Confirmed' } };
    }

    const filterData: FilterData = {
      pagination: null,
      filter: filter,
      select: mSelect,
      sort: this.sortQuery
    }

    this.subDataGetAll = this.projectService.getAllProjects(filterData, null)
      .subscribe({
        next: res => {

          if (res.success) {
            const mData = res.data.map((m) => {
              return {
                projectName: m.projectName ?? '-',
                projectId: m.projectId ?? '-',
                name: m.name ?? '-',
                date: m?.dateString ?? '-',
                domain: m?.domain ?? '-',
                contact: m.contact ?? '-',
                da: m.da ?? '-',
                niche: m?.niche ?? '-',
                secondaryNiche: m?.secondaryNiche ?? '-',
                replyStatus: m?.replyStatus ?? '-',
                guestPostPrice: m?.guestPostPrice ?? '-',
                linkInsertPrice: m?.linkInsertPrice ?? '-',
                condition: m?.condition ?? '-',
                semRushUsTraffic: m?.semRushUsTraffic ?? '-',
                trend: m?.trend ?? '-',
                mode: m?.mode ?? '-',
                ip: m?.ip ?? '-',
                ur: m?.ur ?? '-',
                dr: m?.dr ?? '-',
                ahrefsRank: m?.ahrefsRank ?? '-',
                refDomainsDoFollow: m?.refDomainsDoFollow ?? '-',
                refDomainsGovernmental: m?.refDomainsGovernmental ?? '-',
                refDomainsEducational: m?.refDomainsEducational ?? '-',
                refIPs: m?.refIPs ?? '-',
                refSubNets: m?.refSubNets ?? '-',
                linkedDomains: m?.linkedDomains ?? '-',
                totalBacklinks: m?.totalBacklinks ?? '-',
                backlinksText: m?.backlinksText ?? '-',
                backlinksNoFollow: m?.backlinksNoFollow ?? '-',
                backlinksRedirect: m?.backlinksRedirect ?? '-',
                backlinksImage: m?.backlinksImage ?? '-',
                backlinksFrame: m?.backlinksFrame ?? '-',
                backlinksForm: m?.backlinksForm ?? '-',
                backlinksGovernmental: m?.backlinksGovernmental ?? '-',
                backlinksEducational: m?.backlinksEducational ?? '-',
                keywordsRankedFor: m?.keywordsRankedFor ?? '-',
                ahrefTraffic: m?.ahrefTraffic ?? '-',
                trafficDate: m?.trafficDate ?? '-',
                googleIndex: m?.googleIndex ?? '-',
                semRushBackLinks: m?.semRushBackLinks ?? '-',
                semRushSubDomainBacklinks: m?.semRushSubDomainBacklinks ?? '-',
                bingIndex: m?.bingIndex ?? '-',
                semRushRank: m?.semRushRank ?? '-',
                price: m?.price ?? '-',
                linkInsert: m?.linkInsert ?? '-',
                traffic: m?.traffic ?? '-',
                keywords: m?.keywords ?? '-',
              };
            });

            // EXPORT XLSX
            const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(mData);
            const wb: XLSX.WorkBook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Data');
            XLSX.writeFile(wb, `Projects_${date}.xlsx`);
          }
        },
        error: (err) => {
          console.log(err);
        },
      });

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
    this.sortQuery = { createdAt: -1 };
    this.filter = null;
    this.dataFormDateRange.reset();
    // Re fetch Data
    if (this.currentPage > 1) {
      this.router.navigate([], { queryParams: { page: 1 } }).then();
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

  public openConfirmDialogForViewData(projectId: string) {
    if (projectId) {
      this.getProjectById(projectId)
    }


  }


  /**
   * FILTER DATA With Date Range
   * endChangeRegDateRange()
   * endChangeDeliveryDateRange()
   */

  endChangeRegDateRange(event: MatDatepickerInputEvent<any>) {
    if (event.value) {
      const startDate = this.utilsService.getDateString(
        this.dataFormDateRange.value.start
      );
      const endDate = this.utilsService.getNextDateStringForProject(
        this.dataFormDateRange.value.end,
        0
      );

      const qData = { dateString: { $gte: startDate, $lte: endDate } };
      this.filter = { ...this.filter, ...qData };


      if (this.currentPage > 1) {
        this.router.navigate([], { queryParams: { page: 1 } });
      } else {
        this.getAllProjects();
      }
    }
  }


  /**
   * PAGINATION CHANGE
   * onPageChanged()
   */
  public onPageChanged(event: any) {
    this.router.navigate([], { queryParams: { page: event } }).then();
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
      workBook = XLSX.read(data, { type: 'binary' });
      jsonData = workBook.SheetNames.reduce((initial: any, name: any) => {
        const sheet = workBook.Sheets[name];
        initial[name] = XLSX.utils.sheet_to_json(sheet);
        return initial;
      }, {});

      // Modify Attributes
      const jsonDataArr: any[] = Object.values(jsonData)[0] as any[];

      // console.log('jsonDataArr', jsonDataArr)


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
   * No Content Action
   * onActionBtnTrigger()
   */
  onActionBtnTrigger() {
    this.isLoading = true;
    this.onClearDataQuery()
  }

  handleOutsideClick(): void {
    this.showMinMax = false;
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
    if (this.subDataGetAll2) {
      this.subDataGetAll2.unsubscribe();
    }
    if (this.subDataDeleteMulti) {
      this.subDataDeleteMulti.unsubscribe();
    }
    if (this.subDataUpdateMulti) {
      this.subDataUpdateMulti.unsubscribe();
    }


  }


}
