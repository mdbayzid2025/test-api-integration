import {Component, inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, NgForm, Validators} from "@angular/forms";
import {AffiliateProduct} from "../../../interfaces/common/affiliate-product.interface";
import {Select} from "../../../interfaces/core/select";
import {DATA_STATUS} from "../../../core/utils/app-data";
import {ConfirmDialogComponent} from "../../../shared/components/ui/confirm-dialog/confirm-dialog.component";
import {PageDataService} from "../../../services/core/page-data.service";
import {Title} from "@angular/platform-browser";
import {UtilsService} from "../../../services/core/utils.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AffiliateProductService} from "../../../services/common/affiliate-product.service";
import {MatDialog} from "@angular/material/dialog";
import {UiService} from "../../../services/core/ui.service";
import {Subscription} from "rxjs";
import {AdminService} from "../../../services/common/admin.service";

@Component({
  selector: 'app-add-affiliate-product',
  templateUrl: './add-affiliate-product.component.html',
  styleUrl: './add-affiliate-product.component.scss'
})
export class AddAffiliateProductComponent implements OnInit, OnDestroy {

  // Decorator
  @ViewChild('formElement') formElement: NgForm;

  // Data Form
  dataForm?: FormGroup;

  // Store Data
  id: string;
  affiliateProduct: AffiliateProduct;
  dataStatus: Select[] = DATA_STATUS;
  // urlTypes: Select[] = URL_TYPES;
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
  private readonly affiliateProductService = inject(AffiliateProductService);
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
        this.getAffiliateProductById();
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
    this.title.setTitle('Add AffiliateProduct');
    this.pageDataService.setPageData({
      title: 'Add AffiliateProduct',
      navArray: [
        {name: 'Dashboard', url: `/dashboard`},
        {name: 'Add AffiliateProduct', url: null},
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
      url: [null],
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

    if (this.dataForm.value.urlType === 'internal') {
      mData = {
        ...mData,
        ...{
          url: this.utilsService.extractPath(this.dataForm.value.url)
        }
      }
    }

    if (!this.affiliateProduct) {
      this.addAffiliateProduct(mData);
    } else {
      this.updateAffiliateProductById(mData);
    }
  }

  onDiscard() {
    if (this.dataForm.dirty) {
      this.openConfirmDialog();
    } else {
      this.router.navigate(['/', 'affiliate-product', 'all-affiliate-product']).then();
    }
  }

  private setFormValue() {
    this.dataForm.patchValue(this.affiliateProduct);

    if (this.affiliateProduct.images) {
      this.pickedImages = this.affiliateProduct.image;
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
        this.router.navigate(['/catalog/all-affiliateProduct']).then();
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
   * getAffiliateProductById()
   * addAffiliateProduct()
   * updateAffiliateProductById()
   */
  private getAffiliateProductById() {
    const subscription = this.affiliateProductService.getAffiliateProductById(this.id).subscribe({
      next: (res) => {
        if (res.data) {
          this.affiliateProduct = res.data;
          this.setFormValue();
        }
      },
      error: (error) => {
        console.log(error);
      },
    });
    this.subscriptions.push(subscription);
  }

  private addAffiliateProduct(data: any) {
    const subscription = this.affiliateProductService.addAffiliateProduct(data)
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

  private updateAffiliateProductById(data: any) {
    const subscription = this.affiliateProductService.updateAffiliateProductById(this.affiliateProduct._id, data)
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
