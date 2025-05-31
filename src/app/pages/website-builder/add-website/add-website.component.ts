import {Component, inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {adminBaseMixin} from "../../../mixin/admin-base.mixin";
import {FormBuilder, FormGroup, NgForm, Validators} from "@angular/forms";
import {NavBreadcrumb} from "../../../interfaces/core/nav-breadcrumb.interface";
import {Shop} from "../../../interfaces/common/shop.interface";
import {CLONE_URLS, DATA_BOOLEAN, DOMAIN_TYPES, SHOP_TYPES, THEME_DATA_STATUS} from "../../../core/utils/app-data";
import {Select} from "../../../interfaces/core/select";
import {Subscription} from "rxjs";
import {Router} from "@angular/router";
import {UiService} from "../../../services/core/ui.service";
import {MatDialog} from "@angular/material/dialog";
import {ShopService} from "../../../services/common/shop.service";
import {ConfirmDialogComponent} from "../../../shared/components/ui/confirm-dialog/confirm-dialog.component";
import {FilterData} from "../../../interfaces/gallery/filter-data";
import {PackageService} from "../../../services/common/package.service";
import {ThemeService} from "../../../services/common/theme.service";
import {UtilsService} from '../../../services/core/utils.service';
import {
  WebsiteBuildDialogComponent
} from '../../../shared/dialog-view/website-build-dialog/website-build-dialog.component';

@Component({
  selector: 'app-add-website',
  templateUrl: './add-website.component.html',
  styleUrl: './add-website.component.scss'
})
export class AddWebsiteComponent extends adminBaseMixin(Component) implements OnInit, OnDestroy {
  // Data Form
  @ViewChild('formElement') formElement: NgForm;
  dataForm?: FormGroup;

  // Loading Control
  isLoading: boolean = false;

  // Nav Data
  navArray: NavBreadcrumb[] = [
    {name: 'Dashboard', url: `/dashboard`},
    {name: 'All Shop ', url: `/shop/all-shop`},
    {name: 'Add Shop', url: null},
  ];

  protected readonly domainTypes: Select[] =DOMAIN_TYPES;
  protected readonly shopTypes: Select[] =SHOP_TYPES;
  protected readonly themeDataStatus = THEME_DATA_STATUS;

  protected readonly serverIPs: Select[] = [
    {
      value: '128.199.220.202',
      viewValue: '128.199.220.202 (Frontend Saleecom)'
    }
  ];

  // Store Data
  id?: string;
  buildStatus: string;
  shop?: Shop;
  packages: any[] = [];
  storedThemes: any[] = [];
  themes: any[] = [];
  dataBoolean: Select[] = DATA_BOOLEAN;
  cloneUrls: Select[] = CLONE_URLS;
  filteredCloneUrls: Select[] = CLONE_URLS;

  // Subscriptions
  private subDataGet: Subscription;
  private subDataAdd: Subscription;
  private subDataUpdate: Subscription;
  private subRouteParam: Subscription;
  private subDataGetAll: Subscription;

  // Inject
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly uiService = inject(UiService);
  private readonly dialog = inject(MatDialog);
  private readonly shopService = inject(ShopService);
  private readonly packageDataService = inject(PackageService);
  private readonly themeDataService = inject(ThemeService);
  private readonly utilsService = inject(UtilsService);


  ngOnInit(): void {
    // Init Form
    this.initDataForm();

    this.dataForm.get('websiteName').valueChanges.subscribe(value => {
      const slug = this.utilsService.stringToSlug(value);
      this.dataForm.patchValue({slug: slug});
    });

    this.dataForm.get('name').valueChanges.subscribe(value => {
      const slug = this.utilsService.stringToSlug(value);
      this.dataForm.patchValue({username: slug});
    });


    // Get all Data
    this.getAllTheme()
    this.getAllPackage();

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
      phoneNo: [null, Validators.required],
      username: [null, Validators.required],
      password: ['admin123456', Validators.required],
      websiteName: [null, Validators.required],
      hostDomain: ['saleecom.shop'],
      domainType: ['sub-domain'],
      slug: [null],
      needWebsiteBuild: [true],
      serverIp: [null],
      domain: [null],
      packageId: [null],
      needData: [true],
      isSsr: [false],
      theme: [null],
      shopType: ['professional'],
      themeStatus: ['professional'],
      cloneWebUrl: ['gadgetshob.saleecom.shop'],
      themeColor: this.fb.group({
        primary: ['#e8007c', Validators.required], // Nested group for theme colors
        secondary: ['#00c153'],
        tertiary: ['#ff00ae'],
      }),
    });
  }



  onSubmit() {


    if (this.dataForm.invalid) {
      this.uiService.message('Please filed all the required field', 'warn');
      return;
    }

    const getDomain = () => {
      if (this.dataForm.get('domainType')?.value === 'sub-domain') {
        return `${this.dataForm.get('slug')?.value}.${this.dataForm.get('hostDomain').value}`;
      } else {
        return this.dataForm.get('domain').value;
      }
    }

    const finalData = {
      ...this.dataForm.value,
      ...{
        isPasswordLess: false,
        registrationType: 'default',
        paymentStatus: 'custom',
        buildStatus: 'pending',
        serverIp: this.serverIPs[0].value,
        domain: getDomain(),
      }
    }

    console.log('finalData', finalData);
    this.createVendorAndShop(finalData)

  }

  onDiscard() {
    if (this.dataForm.dirty) {
      this.openConfirmDialog();
    } else {
      this.router.navigate(['/', 'shop', 'all-shop']).then()
    }
  }

  /**
   * Input Changes
   */


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
        this.router.navigate(['/shop']).then();
      }
    });

  }

  /**
   * HTTP REQ HANDLE
   * getAllVendor()
   * getAllTheme()
   * getAllPackage()
   * getShopById()
   * addShop()
   * updateShopById()
   */


  private getAllTheme() {

    const select = {
      name: 1,
      themeStatus: 1,
      reference: 1,
    }
    const filterData: FilterData = {
      pagination: null,
      filter: null,
      select: select,
      sort: {createdAt: -1}
    }

    this.subDataGetAll = this.themeDataService.getAllTheme(filterData, null)
      .subscribe({
        next: res => {
          this.storedThemes = res.data;
          this.themes = this.storedThemes.filter(f => f.themeStatus === 'professional');
          if (this.themes.length) {
            this.dataForm.patchValue({theme: this.themes[0]._id});
            this.onThemeChange({value: this.themes[0]._id});
          }
        },
        error: err => {
          console.log(err)
        }
      })
  }

  private getAllPackage() {
    const select = {
      name: 1,
    }
    const filterData: FilterData = {
      pagination: null,
      filter: null,
      select: select,
      sort: {createdAt: -1}
    }


    this.subDataGetAll = this.packageDataService.getAllPackage(filterData, null)
      .subscribe({
        next: res => {
          this.packages = res.data;
          if (this.packages.length) {
            this.dataForm.patchValue({packageId: this.packages[0]._id})
          }

        },
        error: err => {
          console.log(err)
        }
      })
  }


  private createVendorAndShop(data: any) {
    this.isLoading = true;
    this.subDataAdd = this.shopService
      .createVendorAndShop(data)
      .subscribe({
        next: (res) => {
          this.isLoading = false;
          if (res.success) {
            this.uiService.message(res.message, 'success');
            this.openWebsiteBuildDialog({
              ...data,
              ...{
                shop: res.data.shop
              }
            });
          } else {
            this.uiService.message(res.message, 'warn');
          }
        },
        error: (error) => {
          this.uiService.message('Something went wrong!', 'wrong');
          this.isLoading = false;
          console.log(error);
        },
      });
  }



  openWebsiteBuildDialog(data: any): void {
    const dialogRef = this.dialog.open(WebsiteBuildDialogComponent, {
      maxWidth: '600px',
      width: '95%',
      data: data,
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      this.formElement.resetForm();
    });
  }

  onThemeStatusChange(event: any): void {
    this.themes = this.storedThemes.filter(f => f.themeStatus === event.value);
    if (this.themes.length) {
      this.dataForm.patchValue({theme: this.themes[0]._id});
      this.onThemeChange({value: this.themes[0]._id});
    }
  }

  onThemeChange(event: any): void {
    const theme = this.storedThemes.find(f => f._id === event.value);
    if (theme) {
      this.filteredCloneUrls = this.getCloneUrlsByThemes(theme.reference);
      if (this.filteredCloneUrls.length) {
        this.dataForm.patchValue({cloneWebUrl: this.filteredCloneUrls[0].value})
      }
    }

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
    if (this.subDataGetAll) {
      this.subDataGetAll.unsubscribe();
    }
  }

  private getCloneUrlsByThemes(themeRef: string) {
    const refs = themeRef.split(',').map(ref => ref.trim());
    return this.cloneUrls.filter(clone => refs.includes(clone.value));
  }

}
