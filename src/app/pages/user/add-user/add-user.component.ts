import { Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { environment } from '../../../../environments/environment';
import { Select } from '../../../interfaces/core/select';
import { ADMIN_ROLES, DATA_BOOLEAN } from '../../../core/utils/app-data';
import { NavBreadcrumb } from '../../../interfaces/core/nav-breadcrumb.interface';
import { UiService } from '../../../services/core/ui.service';
import { ConfirmDialogComponent } from '../../../shared/components/ui/confirm-dialog/confirm-dialog.component';
import { FileData } from '../../../interfaces/gallery/file-data';
import { FileUploadService } from '../../../services/gallery/file-upload.service';
import { ImageCropComponent } from '../../../shared/components/image-crop/image-crop.component';
import { adminBaseMixin } from "../../../mixin/admin-base.mixin";
import { UserService } from '../../../services/common/user.service';
import { User } from '../../../interfaces/common/user.interface';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.scss'
})
export class AddUserComponent extends adminBaseMixin(Component) implements OnInit, OnDestroy {

  // Env Base Data
  protected readonly env = environment;

  // Data Form
  @ViewChild('formElement') formElement: NgForm;
  dataForm?: FormGroup;

  // Store Data
  private readonly adminBaseUrl: string = environment.adminBaseUrl;
  showPassword: boolean = false;
  id: string = null;
  user: User = null;
  allStatus: Select[] = DATA_BOOLEAN;
  adminRoles: Select[] = ADMIN_ROLES;

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
    { name: 'Dashboard', url: `/${this.adminBaseUrl}/dashboard` },
    { name: 'Users', url: `/${this.adminBaseUrl}/users` },
  ];

  // Inject
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly uiService = inject(UiService);
  private readonly userService = inject(UserService);
  private readonly dialog = inject(MatDialog);
  private readonly fileUploadService = inject(FileUploadService);


  ngOnInit(): void {

    // Init Data Form
    this.initDataForm();

    // Get Data from Param
    this.subActivateRoute = this.activatedRoute.paramMap.subscribe((param) => {
      this.id = param.get('id');
      if (this.id) {
        this.navArray.push({ name: 'Update user', url: null })
        this.getUserById();
      } else {
        this.navArray.push({ name: 'Add New user', url: null })
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
      shop: ["66a3a400f5224e71135a1300"],
      name: [null, Validators.required],
      username: [null, Validators.required],
      email: [null, [Validators.email, Validators.required]],
      phoneNo: [null, Validators.required],
      password: [null],
      registrationType: ['password'],
      profileImg: [null],
      userLevel: [null],
      userId: [null],
      hasAccess: [this.allStatus[0].value, Validators.required],
    });
  }

  private setFormValue() {
    this.dataForm.patchValue({ ...this.user });
    if (this.user.profileImg) {
      this.imgPlaceHolder = this.user.profileImg;
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
        permissions: ['create', 'edit', 'delete', 'get']
      }
    }


    if (this.user) {
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
        this.updateUserById(finalData);
      }

    } else {
      if (this.pickedImage) {
        this.uploadSingleImage('add', mData);
      } else {
        this.addUser(mData);
      }

    }

  }

  onDiscard() {
    if (!this.id && this.dataForm.valid) {
      this.openConfirmDialog();
    } else {
      this.router.navigate(['/', 'users']).then()
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
   * getUserById()
   * addUser()
   * updateUserById()
   * getAllProjects()
   */

  private getUserById() {
    this.subDataGet = this.userService.getUserById(this.id)
      .subscribe({
        next: res => {
          this.user = res.data;

          // Set Data
          if (this.user) {
            this.setFormValue();
          }
        },
        error: err => {
          console.log(err)
        }
      })
  }

  private addUser(data: any) {
    // Start Request Time
    this.reqStartTime = new Date();
    this.dataForm.disable();
    this.subDataAdd = this.userService.userSignup(data)
      .subscribe({
        next: async res => {
          // Loader Logic
          await this.calculateReqTimeAndHideLoader();
          if (res.success) {
            this.uiService.message(res.message, 'success');
            this.formElement.resetForm({ status: this.allStatus[0]?.value, role: this.adminRoles[0].value });
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

  private updateUserById(data: User) {
    // Start Request Time
    this.reqStartTime = new Date();
    this.dataForm.disable();
    this.subDataUpdate = this.userService.updateUserById(this.id, data)
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
            const finalData = { ...data, ...{ profileImg: res.url } };
            this.addUser(finalData);
          }

          if (type === 'update') {
            const finalData = { ...data, ...{ profileImg: res.url } };
            this.updateUserById(finalData);
            if (this.user.profileImg) {
              this.removeSingleFile(this.user.profileImg);
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
    if (this.subFileRemove) {
      this.subFileRemove.unsubscribe();
    }
  }
}
