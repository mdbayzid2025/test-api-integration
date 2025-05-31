import {Component, Inject, inject, OnInit, ViewChild} from '@angular/core';
import {Select} from "../../../../interfaces/core/select";
import {PAYMENT_METHODS} from "../../../../core/utils/app-data";
import {FormBuilder, FormGroup, NgForm, Validators} from "@angular/forms";
import {UiService} from "../../../../services/core/ui.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {UtilsService} from "../../../../services/core/utils.service";
import {AffiliateService} from "../../../../services/common/affiliate.service";
import {Subscription} from "rxjs";
import {FileUploadService} from "../../../../services/gallery/file-upload.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-affiliate-payment-claim-form',
  templateUrl: './affiliate-payment-claim-form.component.html',
  styleUrl: './affiliate-payment-claim-form.component.scss'
})
export class AffiliatePaymentClaimFormComponent implements OnInit {

  // Decorator
  @ViewChild('formElement') formElement: NgForm;


  // Loading Control
  isLoading: boolean = false;


  // Data Form
  dataForm?: FormGroup;

// Image Upload
  imageChangedEvent: any = null;
  staticImage = '/assets/images/avatar/user-young.jpg';
  imgPlaceHolder = '/assets/images/avatar/user-young.jpg';
  defaultPlaceholder = '/assets/images/avatar/user-young.jpg';
  pickedImage?: any;
  file: any = null;
  newFileName: string;

  imgBlob: any = null;

  // Image Control
  pickedImages: any[] = [];
  paymentMethods: Select[] = PAYMENT_METHODS;

  paymentReceipt: string[] = [];
  paymentReceiptFiles: File[] = [];
  oldReceiptFile: string[] = [];
  paymentReceiptNotPicked: boolean = false;

  affiliatePaymentData: any;
  affiliateId: any;
  mData: any;

  // Subscriptions
  private subscriptions: Subscription[] = []

  private subFileUpload: Subscription;


  private readonly uiService = inject(UiService);
  private readonly utilsService = inject(UtilsService);
  private readonly fb = inject(FormBuilder);
  private readonly affiliateService = inject(AffiliateService);
  private readonly fileUploadService = inject(FileUploadService);
  private readonly route = inject(Router);


  constructor(
    public dialogRef: MatDialogRef<AffiliatePaymentClaimFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }


  ngOnInit() {
    this.initDataForm();

    if (this.data) {
      this.affiliateId = this.data?.affiliate._id;
      this.getAffiliatorData(this.data)
      this.setFormValue();
    }
    console.log("this.data", this.data)

    // this.affiliateId = this.route.snapshot.paramMap.get('id');

  }

  /**
   * FORM METHODS
   * initDataForm()
   * onSubmit()
   * onDiscard()
   * setFormValue()
   */

  private setFormValue() {

    const paymentType = this.data?.method ?? this.affiliatePaymentData?.paymentInfo?.paymentType;

    // Find the matched payment method from the list (case-insensitive)
    const matchedMethod = this.paymentMethods.find(
      (pm) => pm.value.toLowerCase() === paymentType?.toLowerCase()
    )?.value;
    console.log("paymentType", paymentType);
    console.log("matchedMethod", matchedMethod);
    this.dataForm.patchValue({
      note: this.data?.note,
      amount: this.data?.amount,
      method: matchedMethod,
    });

    if (this.data.image) {
      this.oldReceiptFile = [this.data.image];
      this.imgPlaceHolder = this.data.image;
      this.paymentReceiptNotPicked = false;

    }

  }


  private initDataForm() {
    this.dataForm = this.fb.group({
      amount: [null, Validators.required],
      method: [null, Validators.required],
      note: [null],
      image: [''], // for uploaded image URL
    });
  }


  private getAffiliatorData(data: any) {
    const subscription = this.affiliateService.getSingleAffiliatePaymentInfo(data?.ownerType, data?.ownerId?._id, data?.affiliate?._id).subscribe({
      next: (res) => {
        if (res) {
          this.affiliatePaymentData = res?.data;
          this.setFormValue();
        }
      },
      error: (error) => {
        console.log(error);
      },
    });
    this.subscriptions.push(subscription);
  }


  onSubmit() {
    if (this.dataForm.invalid) {
      this.uiService.message('Please fill all required field', 'warn');
      return;
    }

    const imageUploadTasks = [];


    // Upload nidImg if selected
    if (this.paymentReceiptFiles && this.paymentReceiptFiles.length) {
      imageUploadTasks.push(
        this.fileUploadService.uploadMultiImageOriginal(this.paymentReceiptFiles).toPromise()
      );
    } else {
      imageUploadTasks.push(Promise.resolve([]));
    }


    Promise.all(imageUploadTasks)
      .then(([paymentReceiptImages]) => {
        this.dataForm.patchValue({
          image: this.paymentReceiptFiles && this.paymentReceiptFiles.length ? paymentReceiptImages[0]?.url : this.data.image ?? null,
        });

        this.mData = {
          ...this.dataForm.value,
          ...{
            ownerId: this.data?.ownerId?._id,
            ownerType: 'admin',
          }


        };

        if (this.data) {
          console.log(" this.mData",  this.mData)
          this.updatePaymentById(this.data._id, this.mData)

        }

      })
      .catch((err) => {
        this.uiService.message('Image upload failed', 'warn');
        this.isLoading = false;
        console.error(err);
      });


  }


  private updatePaymentById(reportId: string, formData: any) {
    this.affiliateService.updatePaymentClearByOwner(reportId, formData).subscribe({
      next: (res) => {
        if (res.success) {
          this.uiService.message('Payment updated successfully', 'success');
          this.dialogRef.close(true); // optional: close dialog on success


        } else {
          this.uiService.message(res.message, 'wrong');
        }
      },
      error: (err) => {
        console.error('API Error', err);
        this.uiService.message('Something went wrong while updating payment', 'wrong');
      },
    });
  }


  /**
   * File Upload
   * uploadSingleImage()
   * removeImageFiles()
   * removeSingleFile()
   */


  onSelectPaymentReceipt(event: any[]) {
    this.paymentReceiptFiles = event;
    this.paymentReceiptNotPicked = false;
  }

  onDeleteOldPaymentReceipt(event: any) {
    this.oldReceiptFile = event;
  }

  onDiscard() {
    this.dialogRef.close();
  }


  /**
   * ON Destroy
   */
  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub?.unsubscribe());
  }

  protected readonly onsubmit = onsubmit;
}
