import { Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { DATA_STATUS } from '../../../core/utils/app-data';
import { NavBreadcrumb } from '../../../interfaces/core/nav-breadcrumb.interface';
import { Select } from '../../../interfaces/core/select';
import { adminBaseMixin } from '../../../mixin/admin-base.mixin';
import { UiService } from '../../../services/core/ui.service';
import { ConfirmDialogComponent } from '../../../shared/components/ui/confirm-dialog/confirm-dialog.component';
import { environment } from '../../../../environments/environment';
import { Announcement } from '../../../interfaces/common/announcement.interface';
import { AnnouncementService } from '../../../services/common/announcement.service';

@Component({
  selector: 'app-add-announcement',
  templateUrl: './add-announcement.component.html',
  styleUrl: './add-announcement.component.scss'
})
export class AddAnnouncementComponent extends adminBaseMixin(Component) implements OnInit, OnDestroy {
  // Data Form
  @ViewChild('formElement') formElement: NgForm;
  dataForm?: FormGroup;

  // Store Data
  private readonly adminBaseUrl: string = environment.adminBaseUrl;


  // Loading Control
  isLoading: boolean = false;

  // Nav Data
  navArray: NavBreadcrumb[] = [
    {name: 'Dashboard', url: `/${this.adminBaseUrl}/dashboard`},
    {name: 'Announcement', url: `/${this.adminBaseUrl}/announcement`},
  ];

  // Store Data
  id?: string;
  announcement?: Announcement;
  dataStatus: Select[] = DATA_STATUS;

  // Subscriptions
  private subDataGet: Subscription;
  private subDataAdd: Subscription;
  private subDataUpdate: Subscription;
  private subRouteParam: Subscription;

  // Inject
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly uiService = inject(UiService);
  private readonly dialog = inject(MatDialog);
  private readonly announcementService = inject(AnnouncementService);


  ngOnInit(): void {
    // Init Form
    this.initDataForm();

    // GET ID FORM PARAM
    this.subRouteParam = this.activatedRoute.paramMap.subscribe((param) => {
      this.id = param.get('id');
      if (this.id) {
        this.navArray.push({name: 'Update Announcement', url: null})
        this.getAnnouncementById();
      } else {
        this.navArray.push({name: 'Add New Announcement', url: null})
      }
    });
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
      name: [null, Validators.required],
      description: [null],
      url: [null],
      images: [null],
      status: [null],
    });
  }

  private setFormValue() {
    this.dataForm.patchValue(this.announcement);

  }

  onSubmit() {
    console.log("this.dataForm.value:::", this.dataForm.value);

    if (this.dataForm.invalid) {
      this.uiService.message('Please filed all the required field', 'warn');
      return;
    }
    if (!this.announcement) {
      this.addAnnouncement();
    } else {
      this.updateAnnouncementById();
    }
  }

  onDiscard() {
    if (this.dataForm.dirty) {
      this.openConfirmDialog();
    } else {
      this.router.navigate(['/','announcement']).then()
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
        this.router.navigate(['/announcement']).then();
      }
    });

  }

  /**
   * HTTP REQ HANDLE
   * getAnnouncementById()
   * addAnnouncement()
   * updateAnnouncementById()
   */

  private getAnnouncementById() {
    this.subDataGet = this.announcementService.getAnnouncementById(this.id).subscribe({
      next: (res) => {
        if (res.data) {
          this.announcement = res.data;
          this.setFormValue();
        }
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  private addAnnouncement() {
    this.subDataAdd = this.announcementService
      .addAnnouncement(this.dataForm.value)
      .subscribe({
        next: (res) => {
          if (res.success) {
            this.uiService.message(res.message, 'success');
            this.formElement.resetForm();
          } else {
            this.uiService.message(res.message, 'warn');
          }
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  private updateAnnouncementById() {
    this.subDataUpdate = this.announcementService
      .updateAnnouncementById(this.announcement._id, this.dataForm.value)
      .subscribe({
        next: (res) => {
          if (res.success) {
            this.uiService.message(res.message, 'success');
          } else {
            this.uiService.message(res.message, 'warn');
          }
        },
        error: (error) => {
          console.log(error);
        },
      });
  }



  /**
   * ON DESTROY
   * ngOnDestroy()
   */

  ngOnDestroy() {
    if (this.subDataGet) {
      this.subDataGet.unsubscribe();
    }
    if (this.subDataAdd) {
      this.subDataAdd.unsubscribe();
    }
    if (this.subDataUpdate) {
      this.subDataUpdate.unsubscribe();
    }
    if (this.subRouteParam) {
      this.subRouteParam.unsubscribe();
    }
  }
}
