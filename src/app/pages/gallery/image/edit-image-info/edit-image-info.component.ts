import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';
import {GalleryService} from "../../../../services/gallery/gallery.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {UiService} from "../../../../services/core/ui.service";
import {FileFolder} from "../../../../interfaces/gallery/file-folder.interface";
import {Gallery} from "../../../../interfaces/gallery/gallery.interface";
import {ReloadService} from "../../../../services/core/reload.service";

@Component({
  selector: 'app-edit-image-info',
  templateUrl: './edit-image-info.component.html',
  styleUrls: ['./edit-image-info.component.scss']
})
export class EditImageInfoComponent implements OnInit {

  // Data Form
  @ViewChild('formElement') formElement: NgForm;
  dataForm?: FormGroup;

  // Store Data
  id: string = null;
  fileFolders: FileFolder[] = [];

  // Subscriptions
  private subDataOne: Subscription;
  private subDataTwo: Subscription;
  private subDataThree: Subscription;

  constructor(
    private fb: FormBuilder,
    private uiService: UiService,
    private galleryService: GalleryService,
    private reloadService: ReloadService,
    public dialogRef: MatDialogRef<EditImageInfoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
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
      folder: [null, Validators.required],
    });
  }
  private setFormValue() {
    this.id = (this.data.gallery as Gallery)._id;
    this.fileFolders = this.data.folders;
    this.dataForm.patchValue({...this.data.gallery});
  }
  onSubmit() {
    if (this.dataForm.invalid) {
      this.uiService.message('Please filed all the required field',"warn");
      return;
    }
    this.updateGalleryById();
  }





  /**
   * HTTP REQ HANDLE
   * getFileFolderById
   * addFileFolder
   * updateGalleryById
   */

  private updateGalleryById() {
    this.subDataThree = this.galleryService
      .updateGalleryById(this.id, this.dataForm.value)
      .subscribe(res => {
        if (res.success) {
          this.reloadService.needRefreshData$();
          this.dialogRef.close(true);
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
