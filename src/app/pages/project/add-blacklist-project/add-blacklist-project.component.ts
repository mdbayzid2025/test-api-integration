import {Component, inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {environment} from '../../../../environments/environment';
import {Project} from '../../../interfaces/common/project.interface';
import {Select} from '../../../interfaces/core/select';
import {REPLY_STATUS} from '../../../core/utils/app-data';
import {NavBreadcrumb} from '../../../interfaces/core/nav-breadcrumb.interface';
import {UiService} from '../../../services/core/ui.service';
import {ProjectService} from '../../../services/common/project.service';
import {ConfirmDialogComponent} from '../../../shared/components/ui/confirm-dialog/confirm-dialog.component';
import {adminBaseMixin} from "../../../mixin/admin-base.mixin";
import {AdminDataService} from '../../../services/common/admin-data.service';
import {Admin} from '../../../interfaces/common/admin.interface';
import {UtilsService} from '../../../services/core/utils.service';
import {CategoryService} from '../../../services/common/category.service';
import {FilterData} from '../../../interfaces/gallery/filter-data';
import {Category} from '../../../interfaces/common/category.interface';

@Component({
  selector: 'app-add-blacklist-project',
  templateUrl: './add-blacklist-project.component.html',
  styleUrl: './add-blacklist-project.component.scss'
})
export class AddBlacklistProjectComponent extends adminBaseMixin(Component) implements OnInit, OnDestroy {

  // Env Base Data
  protected readonly env = environment;

  // Data Form
  @ViewChild('formElement') formElement: NgForm;
  dataForm?: FormGroup;

  // Store Data
  private readonly adminBaseUrl: string = environment.adminBaseUrl;
  id: string = null;
  project: Project = null;
  replyStatus: Select[] = REPLY_STATUS;
  admin: Admin;
  categories: Category[] = [];

  // Loading Control
  isLoading: boolean = false;
  private reqStartTime: Date = null;
  private reqEndTime: Date = null;

  // Subscriptions
  private subActivateRoute: Subscription;
  private subDataGet: Subscription;
  private subDataGetAll: Subscription;
  private subDataAdmin: Subscription;
  private subDataAdd: Subscription;
  private subDataUpdate: Subscription;

  // Nav Data
  navArray: NavBreadcrumb[] = [
    {name: 'Dashboard', url: `/${this.adminBaseUrl}/dashboard`},
    {name: 'Blacklists', url: `/${this.adminBaseUrl}/projects/black-list`},
  ];

  // Inject
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly uiService = inject(UiService);
  private readonly projectService = inject(ProjectService);
  private readonly dialog = inject(MatDialog);
  private readonly adminDataService = inject(AdminDataService);
  private readonly utilsService = inject(UtilsService);
  private readonly categoryDataService = inject(CategoryService);


  ngOnInit(): void {

    // Init Data Form
    this.initDataForm();

    // Get Data from Param
    this.subActivateRoute = this.activatedRoute.paramMap.subscribe((param) => {
      this.id = param.get('id');
      if (this.id) {
        this.navArray.push({name: 'Update blacklist', url: null})
        this.getProjectById();
      } else {
        this.navArray.push({name: 'Add New blacklist', url: null})
      }
    });

    // Base Data
    this.getLoggedInAdminData();
    this.getAllCategory();
  }

  /**
   * FORM METHODS
   * initDataForm()
   * setFormValue()
   * onSubmit()
   * onDiscard()
   */

  private initDataForm() {
    this.dataForm = this.fb.group({
      domain: [null, Validators.required],
    });
  }

  private setFormValue() {
    this.dataForm.patchValue({...this.project});
  }

  onSubmit() {
    if (this.dataForm.invalid) {
      this.uiService.message('Please filed all the required field', 'warn');
      return;
    }


    this.isLoading = true;
    const mData = {
      ...this.dataForm.value,
      ...{
        projectName: this.dataForm.value.domain,
        status: 'Pending',
        name: this.admin.name,
        admin: this.admin,
        date: this.utilsService.getDateWithCurrentTime(new Date()),
        dateString: this.utilsService.getDateString(new Date())
      }
    }

    if (this.project) {
      this.updateProjectById(mData);
    } else {
      this.addProject(mData);

    }

  }

  onDiscard() {
    if (this.dataForm.dirty) {
      this.openConfirmDialog();
    } else {
      this.router.navigate(['/', 'projects', 'black-list']).then()
    }
  }

  /**
   * COMPONENT DIALOG VIEW
   * openConfirmDialog()
   */
  public openConfirmDialog() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '400px',
      data: {
        title: 'Confirm Discard',
        message: 'Are you sure you want discard?'
      }
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.router.navigate(['/projects/black-list']).then();
      }
    });

  }

  /**
   * HTTP REQ HANDLE
   * getLoggedInAdminData()
   * getAllCategory()
   * getProjectById()
   * addProject()
   * updateProjectById()
   */

  private getLoggedInAdminData() {
    this.subDataAdmin = this.adminDataService.getLoggedInAdminData('name username userId')
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

    this.subDataGetAll = this.categoryDataService.getAllCategories(filterData, null)
      .subscribe({
        next: res => {
          this.categories = res.data;
        },
        error: err => {
          console.log(err)
        }
      })
  }

  private getProjectById() {
    this.subDataGet = this.projectService.getProjectById(this.id)
      .subscribe({
        next: res => {
          this.project = res.data;
          // Set Data
          if (this.project) {
            this.setFormValue();
          }
        },
        error: err => {
          console.log(err)
        }
      })
  }

  private addProject(data: Project) {
    // Start Request Time
    this.reqStartTime = new Date();
    this.dataForm.disable();
    this.subDataAdd = this.projectService.addProject(data)
      .subscribe({
        next: async res => {
          // Loader Logic
          await this.calculateReqTimeAndHideLoader();
          if (res.success) {
            this.uiService.message(res.message, 'success');
            this.formElement.resetForm();
            this.dataForm.enable();
          } else {
            this.dataForm.enable();
            this.uiService.message(res.message, 'warn');
          }
        },
        error: err => {
          this.isLoading = false;
          this.dataForm.enable();
          console.log(err)
        }
      })
  }

  private updateProjectById(data: Project) {
    // Start Request Time
    this.reqStartTime = new Date();
    this.dataForm.disable();
    this.subDataUpdate = this.projectService.updateProjectById(this.id, data)
      .subscribe({
        next: async res => {
          // Loader Logic
          await this.calculateReqTimeAndHideLoader();
          if (res.success) {
            this.uiService.message(res.message, 'success');
            this.dataForm.enable();
          } else {
            this.dataForm.enable();
            this.uiService.message(res.message, 'warn');
          }
        },
        error: err => {
          this.isLoading = false;
          this.uiService.message(err.message, 'wrong');
          this.dataForm.enable();
          console.log(err)
        }
      })
  }

  /**
   * Request Time Calculate and Loader Logic
   * calculateReqTimeAndHideLoader()
   */

  private async calculateReqTimeAndHideLoader() {
    return new Promise((resolve) => {
      // Response Time Loader
      this.reqEndTime = new Date;
      const totalReqTimeInSec = (this.reqEndTime.getTime() - this.reqStartTime.getTime()) / 1000;
      if (totalReqTimeInSec < 0.5) {
        setTimeout(() => {
          this.isLoading = false;
          resolve(true);
        }, 500)
      } else {
        this.isLoading = false;
        resolve(true);
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

    if (this.subDataGet) {
      this.subDataGet.unsubscribe();
    }

    if (this.subDataGetAll) {
      this.subDataGetAll.unsubscribe();
    }

    if (this.subDataAdmin) {
      this.subDataAdmin.unsubscribe();
    }

    if (this.subDataAdd) {
      this.subDataAdd.unsubscribe();
    }
    if (this.subDataUpdate) {
      this.subDataUpdate.unsubscribe();
    }
  }
}
