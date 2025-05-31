import {Component, Inject, inject, OnInit, ViewChild} from '@angular/core';
import {StringToSlugPipe} from "../../../../shared/pipes/string-to-slug.pipe";
import {FormBuilder, FormGroup, NgForm, Validators} from "@angular/forms";
import {Brand} from "../../../../interfaces/common/brand.interface";
import {defaultUploadImage} from "../../../../core/utils/app-data";
import {Subscription} from "rxjs";
import {UiService} from "../../../../services/core/ui.service";
import {BrandService} from "../../../../services/common/brand.service";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {AllImagesDialogComponent} from "../../../gallery/image/all-images-dialog/all-images-dialog.component";
import {Gallery} from "../../../../interfaces/gallery/gallery.interface";

@Component({
  selector: 'app-add-brand',
  templateUrl: './add-brand.component.html',
  styleUrl: './add-brand.component.scss',
  providers: [StringToSlugPipe]
})
export class AddBrandComponent implements OnInit{

  // Data Form
  @ViewChild('formElement') formElement: NgForm;
  dataForm?: FormGroup;

  // Store Data
  autoSlug: boolean = true;
  id?: string;
  brand?: Brand;

  // Image Picker
  pickedImage = defaultUploadImage;
  featurePickedImage = defaultUploadImage;

  // Subscriptions
  private subDataOne: Subscription;
  private subAutoSlug: Subscription;

  // Inject
  private readonly fb = inject(FormBuilder);
  private readonly uiService = inject(UiService);
  private readonly brandService = inject(BrandService);
  private readonly dialog = inject(MatDialog);

  constructor(
    public dialogRef: MatDialogRef<AddBrandComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {url: string}
  ) {
  }

  ngOnInit(): void {
    // Init Form
    this.initDataForm();

    // Auto Slug
    this.autoGenerateSlug();
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
      slug: [null],
      image: [null],
      status: ['publish'],
    });
  }


  onSubmit() {
    if (this.dataForm.invalid) {
      this.uiService.message('Please filed all the required field', 'warn');
      return;
    }

    this.addBrand();
  }


  private addBrand() {
    this.subDataOne = this.brandService.addBrand(this.dataForm.value)
      .subscribe({
        next: (res => {
          if (res.success) {
            this.uiService.message(res.message,"success");
            this.formElement.resetForm();
            this.pickedImage = defaultUploadImage;
            this.featurePickedImage = defaultUploadImage;
          } else {
            this.uiService.message(res.message,"warn");
          }
        }),
        error: (error => {
          console.log(error);
        })
      });
  }

  /**
   * LOGICAL PART
   * autoGenerateSlug()
   */
  autoGenerateSlug() {
    if (this.autoSlug === true) {
      this.subAutoSlug = this.dataForm.get('name').valueChanges
        .pipe(
          // debounceTime(200),
          // distinctUntilChanged()
        ).subscribe(d => {
          const res = d?.trim().replace(/\s+/g, '-').toLowerCase();
          this.dataForm.patchValue({
            slug: res
          });
        });
    } else {
      if (!this.subAutoSlug) {
        return;
      }
      this.subAutoSlug?.unsubscribe();
    }
  }


  /**
   * COMPONENT DIALOG
   * openGalleryDialog
   */

  public openGalleryDialog() {
    const dialogRef = this.dialog.open(AllImagesDialogComponent, {
      data: {type: 'single', count: 1},
      panelClass: ['theme-dialog', 'full-screen-modal-lg'],
      width: '100%',
      minHeight: '100%',
      autoFocus: false,
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        if (dialogResult.data && dialogResult.data.length > 0) {
          const image: Gallery = dialogResult.data[0] as Gallery;
          this.dataForm.patchValue({image: image.url});
          this.pickedImage = image.url;
        }
      }
    });
  }

  /**
   * ON CLOSE DIALOG
   * onClose()
   */
  onClose() {
    this.dialogRef.close()
  }


  /**
   * ON DESTROY
   */
  ngOnDestroy() {
    if (this.subDataOne) {
      this.subDataOne.unsubscribe();
    }
    if (this.subAutoSlug) {
      this.subAutoSlug.unsubscribe();
    }
  }
}

