import {MatCheckbox, MatCheckboxChange} from '@angular/material/checkbox';
import {Component, HostListener, inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {adminBaseMixin} from '../../../mixin/admin-base.mixin';
import {environment} from '../../../../environments/environment';
import {Admin} from '../../../interfaces/common/admin.interface';
import {Project} from '../../../interfaces/common/project.interface';
import {NavBreadcrumb} from '../../../interfaces/core/nav-breadcrumb.interface';
import {Subscription} from 'rxjs';
import {ProjectService} from '../../../services/common/project.service';
import {MatDialog} from '@angular/material/dialog';
import {UtilsService} from '../../../services/core/utils.service';
import {AdminDataService} from '../../../services/common/admin-data.service';
import {ConfirmDialogComponent} from '../../../shared/components/ui/confirm-dialog/confirm-dialog.component';
import {AddProjectDialogComponent} from '../../../shared/components/add-project-dialog/add-project-dialog.component';
import * as XLSX from 'xlsx';
import {CategoryService} from '../../../services/common/category.service';
import {Category} from '../../../interfaces/common/category.interface';
import {FilterData} from '../../../interfaces/gallery/filter-data';
import {UiService} from "../../../services/core/ui.service";
import {ReloadService} from "../../../services/core/reload.service";

@Component({
  selector: 'app-all-analyzer',
  templateUrl: './all-analyzer.component.html',
  styleUrl: './all-analyzer.component.scss'
})
export class AllAnalyzerComponent extends adminBaseMixin(Component) implements OnInit, OnDestroy {

  // Env Base Data
  protected readonly env = environment;

  // Store Data
  private readonly adminBaseUrl: string = environment.adminBaseUrl;
  admin: Admin;
  projects: Project[] = [];
  private holdPrevProjects: Project[] = [];
  categories: Category[] = [];

  // Search
  searchQuery: string;

  // Selected Data
  isIndeterminate: boolean = false;
  selectedIds: string[] = [];
  @ViewChild('matCheckbox') private matCheckbox: MatCheckbox;

  // Loading Control
  isLoading: boolean = false;
  private reqStartTime: Date = null;
  private reqEndTime: Date = null;

  // Unsaved Changes
  isUnsavedData: boolean = false;
  private isNavigatingBack: boolean = false;

  // Pagination
  currentPage = 1;
  totalData = 0;
  dataPerPage = 100;
  totalDataStore = 0;


  // Nav Data
  navArray: NavBreadcrumb[] = [
    {name: 'Dashboard', url: `/${this.adminBaseUrl}/dashboard`},
    {name: 'Analyzers', url: null},
  ];

  // Subscriptions
  private subActivateRoute: Subscription;
  private subSearch: Subscription;
  private subReload: Subscription;
  private subDataGetAll: Subscription;
  private subDataGetAllCat: Subscription;
  private subDataGet: Subscription;
  private subDataDeleteMulti: Subscription;
  private subDataUpdateMulti: Subscription;

  // Inject
  private readonly projectService = inject(ProjectService);
  private readonly dialog = inject(MatDialog);
  private readonly utilsService = inject(UtilsService);
  private readonly adminDataService = inject(AdminDataService);
  private readonly categoryDataService = inject(CategoryService);
  private readonly uiService = inject(UiService);
  private readonly reloadService = inject(ReloadService);

  ngOnInit() {
    // Reload Data
    this.subReload = this.reloadService.refreshData$.subscribe(() => {
      this.getLoggedInAdminData();
      this.getAllCategory();
    })

    // Base Data
    this.getLoggedInAdminData();
    this.getAllCategory();

  }


  /**
   * Prevent Back & Close Tab or Browser
   * unloadNotification()
   * onPopState()
   */
  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any): void {
    if (this.isUnsavedData) {
      $event.returnValue = 'Are you sure you want to leave?';
    }
  }

  @HostListener('window:popstate', ['$event'])
  onPopState(event: any) {
    if (!this.isNavigatingBack && this.isUnsavedData) {
      const confirmation = confirm('Do you really want to leave?');
      if (!confirmation) {
        history.pushState(null, '', location.href);
      } else {
        this.isNavigatingBack = true;
        history.back();
      }
    }
  }


  /**
   * HTTP REQ HANDLE
   * analysisMultipleProject()
   * getLoggedInAdminData()
   */
  private analysisMultipleProject(data: any[]) {
    // Start Request Time
    this.reqStartTime = new Date();

    this.subDataGetAll = this.projectService.analysisMultipleProject(data)
      .subscribe({
        next: res => {

          this.isLoading = false;
          this.projects = res.data;
          this.holdPrevProjects = [...this.projects];
          // Response Time Loader
          this.calculateReqTimeAndHideLoader();
        },
        error: err => {
          // this.isLoading = false;
          console.log(err)
        }
      })
  }

  private getLoggedInAdminData() {
    this.subDataGet = this.adminDataService.getLoggedInAdminData('name username userId')
      .subscribe({
        next: res => {
          this.admin = res.data;
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
      sort: {name: 1}
    }

    this.subDataGetAllCat = this.categoryDataService.getAllCategories(filterData, null)
      .subscribe({
        next: res => {
          this.categories = res.data;
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
   * onAllSelectChange()
   * onCheckChange()
   * deleteMultipleProjectById()
   */

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

  private deleteMultipleProjectById() {
    this.subDataDeleteMulti = this.projectService.deleteMultipleProjectById(this.selectedIds)
      .subscribe({
        next: res => {
          if (res.success) {
            this.selectedIds = [];
            this.uiService.message(res.message, 'success');
            // fetch Data
            // if (this.currentPage > 1) {
            //   this.router.navigate([], {queryParams: {page: 1}}).then();
            // } else {
            //   this.reloadService.needRefreshData$();
            // }
          } else {
            this.uiService.message(res.message, 'warn')
          }
        },
        error: err => {
          console.log(err)
        }
      })
  }

  /**
   * ON SEARCH CHANGE
   * onChangeInput()
   * onResetSearch()
   */
  onChangeInput(event: string, fieldName: string) {
    if (event) {
      const options: { caseSensitive: boolean, includedKeys: string[] } = {
        caseSensitive: false,
        includedKeys: [fieldName],
      }
      this.projects = this.utilsService.searchWithRegex(this.holdPrevProjects, event, options)
    } else {
      this.projects = this.holdPrevProjects;
    }
  }

  onResetSearch() {
    this.searchQuery = null;
    this.projects = this.holdPrevProjects;
  }

  /**
   * COMPONENT DIALOG VIEW
   * openConfirmDialog()
   */
  public openConfirmDialog(type: 'edit' | 'delete', data?: any) {
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
          this.selectedIds.forEach((id) => {
            const fIndex = this.projects.findIndex(f => f._id === id);
            this.projects.splice(fIndex, 1);
          })
          // this.deleteMultipleProjectById();
        }
      });
    } else if (type === 'edit') {
      const dialogRef = this.dialog.open(AddProjectDialogComponent, {
        maxWidth: '1200px',
        width: '100%',
        data: {project: data, admin: this.admin, categories: this.categories}
      });
      dialogRef.afterClosed().subscribe(dialogResult => {
        if (dialogResult) {
          const fIndex = this.projects.findIndex(f => f._id === dialogResult._id);
          this.projects.splice(fIndex, 1);
        }
      });

    }

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
      const finalData: any[] = [];
      jsonDataArr.forEach(m => {
        const domain = this.utilsService.getHostnameFromUrl(m['Url'])
        if (domain) {
          const obj =  {
            url: m['Url'],
            domain: domain,
            googleIndex: m['Google index'],
            semRushBackLinks: m['SEMrush backlinks'],
            semRushSubDomainBacklinks: m['SEMrush backlinks'],
            bingIndex: m['Bing index'],
            semRushSeTraffic: m['SEMrush SE Traffic'],
            semRushRank: m['SEMrush Rank'],
            status: 'Pending'
          }
          finalData.push(obj)
        }

      });

      // Notify for changes and push States
      history.pushState(null, '', location.href); // Push initial state to handle back button
      this.isUnsavedData = true;

      console.log('finalData', finalData.length);

      // Upload and Check From DB
      this.analysisMultipleProject(finalData);
    };

    reader.readAsBinaryString(file);
  }

  /**
   * PAGINATION CHANGE
   * onPageChanged()
   */
  public onPageChanged(event: any) {
   this.currentPage = event;
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
    if (this.subDataGet) {
      this.subDataGet.unsubscribe();
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
