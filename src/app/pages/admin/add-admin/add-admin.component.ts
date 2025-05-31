import { Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { DATA_BOOLEAN, ADMIN_ROLES, GENDERS } from '../../../core/utils/app-data';
import { Admin } from '../../../interfaces/common/admin.interface';
import { NavBreadcrumb } from '../../../interfaces/core/nav-breadcrumb.interface';
import { Select } from '../../../interfaces/core/select';
import { FileData } from '../../../interfaces/gallery/file-data';
import { adminBaseMixin } from '../../../mixin/admin-base.mixin';
import { AdminDataService } from '../../../services/common/admin-data.service';
import { UiService } from '../../../services/core/ui.service';
import { FileUploadService } from '../../../services/gallery/file-upload.service';
import { ImageCropComponent } from '../../../shared/components/image-crop/image-crop.component';
import { ConfirmDialogComponent } from '../../../shared/components/ui/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-add-admin',
  templateUrl: './add-admin.component.html',
  styleUrl: './add-admin.component.scss'
})
export class AddAdminComponent extends adminBaseMixin(Component) implements OnInit, OnDestroy {

  // Env Base Data
  protected readonly env = environment;

  // Data Form
  @ViewChild('formElement') formElement: NgForm;
  dataForm?: FormGroup;

  // Store Data
  private readonly adminBaseUrl: string = environment.adminBaseUrl;
  showPassword: boolean = false;
  id: string = null;
  admin: Admin = null;
  allStatus: Select[] = DATA_BOOLEAN;
  adminRoles: Select[] = ADMIN_ROLES;
  genders: Select[] = GENDERS;

  // Loading Control
  isLoading: boolean = false;
  private reqStartTime: Date = null;
  private reqEndTime: Date = null;

  // Image Picker

  // Image Upload
  imageChangedEvent: any = null;
  staticImage = '/assets/images/avatar/user-young.jpg';
  imgPlaceHolder = '/assets/images/avatar/user-young.jpg';

  pickedImage?: any;
  file: any = null;
  newFileName: string;

  imgBlob: any = null;

  // Subscriptions
  private subActivateRoute: Subscription;
  private subDataGet: Subscription;
  private subDataGetAll: Subscription;
  private subDataAdd: Subscription;
  private subDataUpdate: Subscription;
  private subFileUpload: Subscription;
  private subFileRemove: Subscription;

  // Nav Data
  navArray: NavBreadcrumb[] = [
    {name: 'Dashboard', url: `/${this.adminBaseUrl}/dashboard`},
    {name: 'Admin', url: `/${this.adminBaseUrl}/admin`},
  ];

  // Inject
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly uiService = inject(UiService);
  private readonly adminDataService = inject(AdminDataService);
  private readonly dialog = inject(MatDialog);
  private readonly fileUploadService = inject(FileUploadService);


  ngOnInit(): void {

    // Init Data Form
    this.initDataForm();

    // Get Data from Param
    this.subActivateRoute = this.activatedRoute.paramMap.subscribe((param) => {
      this.id = param.get('id');
      if (this.id) {
        this.navArray.push({name: 'Update Admin', url: null})
        this.getAdminById();
      } else {
        this.navArray.push({name: 'Add New Admin', url: null})
      }
    });
  }

  /**
   * FORM METHODS
   * initDataForm()
   * setFormValue()
   * onSubmit()
   * onDiscard()
   * togglePasswordVisibility()
   */

  private initDataForm() {
    this.dataForm = this.fb.group({
      name: [null, Validators.required],
      username: [null, Validators.required],
      phoneNo: [null, Validators.required],
      email: [null, [Validators.email, Validators.required]],
      password: [null],
      isChat: [this.allStatus[1].value],
      profileImg: [null],
      gender: [null],
      userLevel: [null],
      userId: [null],
      registrationAt: [null],
      lastLoggedIn: [null],
      role: [this.adminRoles[0].value, Validators.required],
      hasAccess: [this.allStatus[0].value, Validators.required],
    });
  }

  private setFormValue() {
    this.dataForm.patchValue({...this.admin});
    if (this.admin.profileImg) {
      this.imgPlaceHolder = this.admin.profileImg;
    }
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
        registrationType: 'default',
        isPasswordLess: false,
        permissions:this.dataForm.value.role === 'editor' ?  ['create', 'edit', 'get'] :  ['create', 'edit', 'delete', 'get']
      }
    }


    if (this.admin) {
      let finalData = mData;
      if (this.dataForm.value.password) {
        finalData = {
          ...finalData,
          ...{
            newPassword: this.dataForm.value.password
          }
        }
      }
      if (this.pickedImage) {
        this.uploadSingleImage('update', mData);
      } else {
        this.updateAdminById(finalData);
      }

    } else {
      if (this.pickedImage) {
        this.uploadSingleImage('add', mData);
      } else {
        this.addAdmin(mData);
      }

    }

  }

  onDiscard() {
    if (!this.id && this.dataForm.valid) {
      this.openConfirmDialog();
    } else {
      this.router.navigate(['/', 'admin']).then()
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
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
        this.router.navigate(['/', this.env.adminBaseUrl, 'users']).then();
      }
    });

  }


  fileChangeEvent(event: any) {
    this.file = (event.target as HTMLInputElement).files[0];
    // File Name Modify...
    const originalNameWithoutExt = this.file.name.toLowerCase().split(' ').join('-').split('.').shift();
    const fileExtension = this.file.name.split('.').pop();
    // Generate new File Name..
    this.newFileName = `${Date.now().toString()}_${originalNameWithoutExt}.${fileExtension}`;

    const reader = new FileReader();
    reader.readAsDataURL(this.file);

    reader.onload = () => {
      // this.imgPlaceHolder = reader.result as string;
    };

    // Open Upload Dialog
    if (event.target.files[0]) {
      this.openComponentDialog(event);
    }

    // NGX Image Cropper Event..
    this.imageChangedEvent = event;
  }


  /**
   * OPEN COMPONENT DIALOG
   */
  public openComponentDialog(data?: any) {
    const dialogRef = this.dialog.open(ImageCropComponent, {
      data,
      panelClass: ['theme-dialog'],
      autoFocus: false,
      disableClose: true,
      width: '680px',
      minHeight: '400px',
      maxHeight: '600px'
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        if (dialogResult.imgBlob) {
          this.imgBlob = dialogResult.imgBlob;
        }
        if (dialogResult.croppedImage) {
          this.pickedImage = dialogResult.croppedImage;
          this.imgPlaceHolder = this.pickedImage;
        }
      }
    });
  }

  /**
   * HTTP REQ HANDLE
   * getAdminById()
   * addAdmin()
   * updateAdminById()
   * getAllProjects()
   */

  private getAdminById() {
    this.subDataGet = this.adminDataService.getAdminById(this.id)
      .subscribe({
        next: res => {
          this.admin = res.data;

          // Set Data
          if (this.admin) {
            this.setFormValue();
          }
        },
        error: err => {
          console.log(err)
        }
      })
  }

  private addAdmin(data: any) {
    // Start Request Time
    this.reqStartTime = new Date();
    this.dataForm.disable();
    this.subDataAdd = this.adminDataService.adminSignup(data)
      .subscribe({
        next: async res => {
          // Loader Logic
          await this.calculateReqTimeAndHideLoader();
          if (res.success) {
            this.uiService.message(res.message, 'success');
            this.formElement.resetForm({status: this.allStatus[0]?.value, role: this.adminRoles[0].value});
            if (this.pickedImage) {
              this.removeImageFiles();
            }
            this.dataForm.enable();
          } else {
            this.dataForm.enable();
            this.uiService.message(res.message, 'warn');
          }
        },
        error: err => {
          this.uiService.message(err?.error?.
              message[0], 'wrong');
          this.isLoading = false;
          this.dataForm.enable();
          console.log(err)
        }
      })
  }

  private updateAdminById(data: Admin) {
    // Start Request Time
    this.reqStartTime = new Date();
    this.dataForm.disable();
    this.subDataUpdate = this.adminDataService.updateAdminById(this.id, data)
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
   * File Upload
   * uploadSingleImage()
   */

  uploadSingleImage(type: 'add' | 'update', data: any) {
    const fileData: FileData = {
      fileName: this.newFileName,
      file: this.imgBlob,
      folderPath: 'admins'
    };
    this.subFileUpload = this.fileUploadService.uploadSingleImage(fileData)
      .subscribe({
        next: res => {

          if (type === 'add') {
            const finalData = {...data, ...{profileImg: res.url}};
            this.addAdmin(finalData);
          }

          if (type === 'update') {
            const finalData = {...data, ...{profileImg: res.url}};
            this.updateAdminById(finalData);
            if (this.admin.profileImg) {
              this.removeSingleFile(this.admin.profileImg);
            }
          }
        },
        error: err => {
          console.log(err)
        }
      });
  }

  private removeImageFiles() {
    this.file = null;
    this.newFileName = null;
    this.pickedImage = null;
    this.imgBlob = null;
    this.imgPlaceHolder = this.staticImage;
  }

  removeSingleFile(imgUrl: string) {
    this.subFileRemove = this.fileUploadService.removeSingleFile(imgUrl)
      .subscribe({
        next: res => {
        },
        error: err => {
          console.log(err)
        }
      });
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

    if (this.subDataAdd) {
      this.subDataAdd.unsubscribe();
    }
    if (this.subDataUpdate) {
      this.subDataUpdate.unsubscribe();
    }
    if (this.subDataGetAll) {
      this.subDataGetAll.unsubscribe();
    }
    if (this.subFileUpload) {
      this.subFileUpload.unsubscribe();
    }
  }
}
