import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {VendorService} from "../../../../services/common/vendor.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {UiService} from "../../../../services/core/ui.service";
import {FileFolder} from "../../../../interfaces/gallery/file-folder.interface";
import {FileFolderService} from "../../../../services/gallery/file-folder.service";
import {ReloadService} from "../../../../services/core/reload.service";

@Component({
  selector: 'app-add-folder',
  templateUrl: './add-folder.component.html',
  styleUrls: ['./add-folder.component.scss']
})
export class AddFolderComponent implements OnInit {

  // Data Form
  @ViewChild('formElement') formElement: NgForm;
  dataForm?: FormGroup;

  // Store Data
  id?: string;
  fileFolder?: FileFolder;

  // Subscriptions
  private subDataOne: Subscription;
  private subDataTwo: Subscription;
  private subDataThree: Subscription;

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private vendorService: VendorService,
    private fileFolderService: FileFolderService,
    private uiService: UiService,
    private reloadService: ReloadService,
    public dialogRef: MatDialogRef<AddFolderComponent>,
    @Inject(MAT_DIALOG_DATA) public data: FileFolder,
  ) {
  }

  ngOnInit(): void {

    // Init Data Form
    this.initDataForm();

    // GET ID FORM Dialog
    if (this.data) {
      this.setFormValue()
    }
  }

  /**
   * FORMS METHODS
   * initDataForm()
   * setFormValue()
   * onSubmit()
   */
   private initDataForm() {
    this.dataForm = this.fb.group({
      name: [null, Validators.required],
    });
  }
  private setFormValue() {
    this.id = this.data._id;
    this.fileFolder = this.data;
    this.dataForm.patchValue({...this.data});
  }
  onSubmit() {
    if (this.dataForm.invalid) {
      this.uiService.message('Please filed all the required field',"warn");
      return;
    }

    if (this.fileFolder) {
      this.updateFileFolderById();
    } else {
      this.addFileFolder();

    }

  }

  /**
   * HTTP REQ HANDLE
   * getFileFolderById()
   * addFileFolder()
   *updateFileFolderById()
   */
  private getFileFolderById() {
    // const select = 'name email username phoneNo gender role permissions hasAccess'
    this.subDataTwo = this.fileFolderService.getFileFolderById(this.id)
      .subscribe(res => {
        if (res.success) {
          this.fileFolder = res.data;
          this.setFormValue();
        }
      }, error => {
        console.log(error);
      });
  }

  private addFileFolder() {
    this.subDataOne = this.fileFolderService.addFileFolder(this.dataForm.value)
      .subscribe(res => {
        if (res.success) {
          this.reloadService.needRefreshData$();
          this.uiService.message(res.message,"success");
          this.formElement.resetForm();
          this.dialogRef.close();
        } else {
          this.uiService.message(res.message,"warn");
        }
      }, error => {
        console.log(error);
      });
  }

  private updateFileFolderById() {
    this.subDataThree = this.fileFolderService.updateFileFolderById(this.fileFolder._id, this.dataForm.value)
      .subscribe(res => {
        if (res.success) {
          this.reloadService.needRefreshData$();
          this.dialogRef.close();
          this.uiService.message(res.message,"success");
        } else {
          this.uiService.message(res.message,"warn");
        }
      }, error => {
        console.log(error);
      });
  }
    /**
   * ON DESTROY
   */
     ngOnDestroy() {
      if (this.subDataOne) {
        this.subDataOne.unsubscribe();
      }
      if (this.subDataTwo) {
        this.subDataTwo.unsubscribe();
      }
      if (this.subDataThree) {
        this.subDataThree.unsubscribe();
      }
    }

}
