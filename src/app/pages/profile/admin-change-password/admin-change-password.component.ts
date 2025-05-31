import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {UiService} from '../../../services/core/ui.service';
import {AdminDataService} from '../../../services/common/admin-data.service';

@Component({
  selector: 'app-admin-change-password',
  templateUrl: './admin-change-password.component.html',
  styleUrls: ['./admin-change-password.component.scss']
})
export class AdminChangePasswordComponent implements OnInit, OnDestroy {

  dataForm?: FormGroup;

  constructor(
    private fb: FormBuilder,
    private uiService: UiService,
    private adminDataService: AdminDataService,
    public dialogRef: MatDialogRef<AdminChangePasswordComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  ngOnInit(): void {
    this.dataForm = this.fb.group({
      oldPassword: [null, Validators.required],
      password: [null, Validators.required]
    });
  }

  onSubmit() {
    if (this.dataForm.invalid) {
      this.uiService.message('Please complete all the required fields', 'warn');
      return;
    }

    this.changeLoggedInAdminPassword();

  }


  /**
   * HTTP REQ HANDLE
   * GET ATTRIBUTES BY ID
   */

  private changeLoggedInAdminPassword() {
    this.adminDataService.changeLoggedInAdminPassword(this.dataForm.value)
      .subscribe({
        next: res => {
          if (res.success) {
            this.uiService.message(res.message, 'success');
            this.dialogRef.close();
          } else {
            this.uiService.message(res.message, 'warn');
          }
        },
        error: err => {
          console.log(err)
        }
      });
  }

  ngOnDestroy() {

  }


}
