import {Component, inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, NgForm, Validators} from "@angular/forms";
import {PaymentLink} from "../../../interfaces/common/payment-link.interface";
import {Select} from "../../../interfaces/core/select";
import {DATA_STATUS} from "../../../core/utils/app-data";
import {Subscription} from "rxjs";
import {UiService} from "../../../services/core/ui.service";
import {MatDialog} from "@angular/material/dialog";
import {PaymentLinkService} from "../../../services/common/payment-link.service";
import {ActivatedRoute, Router} from "@angular/router";
import {UtilsService} from "../../../services/core/utils.service";
import {PageDataService} from "../../../services/core/page-data.service";
import {Title} from "@angular/platform-browser";
import {AdminService} from "../../../services/common/admin.service";
import {ConfirmDialogComponent} from "../../../shared/components/ui/confirm-dialog/confirm-dialog.component";

@Component({
  selector: 'app-add-payment-link',
  templateUrl: './add-payment-link.component.html',
  styleUrl: './add-payment-link.component.scss'
})
export class AddPaymentLinkComponent implements OnInit, OnDestroy {

  // Decorator
  @ViewChild('formElement') formElement: NgForm;

  // Data Form
  dataForm?: FormGroup;

  // Store Data
  id: string;
  paymentLink: PaymentLink;
  dataStatus: Select[] = DATA_STATUS;

  autoSlug: boolean = true;

  // Loading Control
  isLoading: boolean = false;

  // Image Control
  pickedImages: any[] = [];

  // Subscriptions
  private subscriptions: Subscription[] = []


  // Inject
  private readonly uiService = inject(UiService);
  private readonly dialog = inject(MatDialog);
  private readonly paymentLinkService = inject(PaymentLinkService);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly utilsService = inject(UtilsService);
  private readonly pageDataService = inject(PageDataService);
  private readonly title = inject(Title);
  private readonly adminService = inject(AdminService);

  ngOnInit(): void {
    this.initDataForm();
    // ParamMap Subscription
    const subParamMap = this.activatedRoute.paramMap.subscribe((param) => {
      this.id = param.get('id');
      if (this.id) {
        this.getPaymentLinkById();
      }
    });
    this.subscriptions.push(subParamMap);

    // Auto Slug
    this.autoGenerateSlug();
    this.setPageData();
  }


  /**
   * Page Data
   * setPageData()
   */
  private setPageData(): void {
    this.title.setTitle('Add PaymentLink');
    this.pageDataService.setPageData({
      title: 'Add PaymentLink',
      navArray: [
        {name: 'Dashboard', url: `/dashboard`},
        {name: 'Add PaymentLink', url: null},
      ]
    })
  }

  /**
   * FORM METHODS
   * initDataForm()
   * onSubmit()
   * onDiscard()
   * setFormValue()
   */
  private initDataForm() {
    this.dataForm = this.fb.group({
      name: [null, Validators.required],
      images: [null],
      image: [null],
      description: [null],
      slug: [null],
      type: [null],
      priority: [null],
      price: [null],
      status: ['publish'],
    });
  }

  onSubmit() {
    if (this.dataForm.invalid) {
      this.uiService.message('Please fill all the required fields', 'warn');
      return;
    }


    let mData = {
      ...this.dataForm.value,
      ...{
        ownerId:this.adminService.getAdminId(),
        ownerType:'admin'
      }
    };



    if (!this.paymentLink) {
      this.addPaymentLink(mData);
    } else {
      this.updatePaymentLinkById(mData);
    }
  }

  onDiscard() {
    if (this.dataForm.dirty) {
      this.openConfirmDialog();
    } else {
      this.router.navigate(['/', 'payment-link', 'all-payment-link']).then();
    }
  }

  private setFormValue() {
    this.dataForm.patchValue(this.paymentLink);

    if (this.paymentLink.image) {
      this.pickedImages = [this.paymentLink.image];
    }
  }

  private patchDefaultValue() {
    this.dataForm.patchValue({status: 'publish'});
    this.pickedImages = [];
  }


  /**
   * COMPONENT DIALOG
   * openConfirmDialog()
   * onPickedImage()
   */
  public openConfirmDialog() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '400px',
      data: {
        title: 'Confirm Discard',
        message: 'Are you sure you want to discard?'
      }
    });
    const subDialogResult = dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.router.navigate(['/catalog/all-paymentLink']).then();
      }
    });
    this.subscriptions.push(subDialogResult);
  }

  onPickedImage(event: any) {
    console.log('event',event)
    this.dataForm.patchValue({image: event[0]});
  }

  /**
   * HTTP REQ HANDLE
   * getPaymentLinkById()
   * addPaymentLink()
   * updatePaymentLinkById()
   */
  private getPaymentLinkById() {
    const subscription = this.paymentLinkService.getPaymentLinkById(this.id).subscribe({
      next: (res) => {
        if (res.data) {
          this.paymentLink = res.data;
          this.setFormValue();
        }
      },
      error: (error) => {
        console.log(error);
      },
    });
    this.subscriptions.push(subscription);
  }

  private addPaymentLink(data: any) {
    const subscription = this.paymentLinkService.addPaymentLink(data)
      .subscribe({
        next: (res) => {
          if (res.success) {
            this.uiService.message(res.message, 'success');
            this.formElement.resetForm();
            this.patchDefaultValue();
          } else {
            this.uiService.message(res.message, 'warn');
          }
        },
        error: (error) => {
          console.log(error);
        },
      });
    this.subscriptions.push(subscription);
  }

  private updatePaymentLinkById(data: any) {
    const subscription = this.paymentLinkService.updatePaymentLinkById(this.paymentLink._id, data)
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
    this.subscriptions.push(subscription);
  }

  /**
   * LOGICAL PART
   * autoGenerateSlug()
   */
  autoGenerateSlug() {
    let subAutoSlug: any;
    if (this.autoSlug === true) {
      subAutoSlug = this.dataForm.get('name').valueChanges
        .pipe(

        ).subscribe(d => {
          const res = d?.trim().replace(/\s+/g, '-').toLowerCase();
          this.dataForm.patchValue({
            slug: res
          });
        });
      this.subscriptions.push(subAutoSlug);
    } else {
      if (!subAutoSlug) {
        return;
      }
      this.subscriptions.push(subAutoSlug);
    }
  }

  /**
   * ON Destroy
   */
  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub?.unsubscribe());
  }


}
