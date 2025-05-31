import {Component, inject, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, NgForm} from "@angular/forms";
import {defaultUploadImage} from "../../../core/utils/app-data";
import {Category} from "../../../interfaces/common/category.interface";
import {Subscription} from "rxjs";
import {UiService} from "../../../services/core/ui.service";
import {ActivatedRoute, Router} from "@angular/router";
import {CategoryService} from "../../../services/common/category.service";
import {FileUploadService} from "../../../services/gallery/file-upload.service";
import {MatDialog} from "@angular/material/dialog";
import {StringToSlugPipe} from "../../../shared/pipes/string-to-slug.pipe";
import {adminBaseMixin} from "../../../mixin/admin-base.mixin";
import {ConfirmDialogComponent} from "../../../shared/components/ui/confirm-dialog/confirm-dialog.component";
import {environment} from "../../../../environments/environment";
import {NavBreadcrumb} from "../../../interfaces/core/nav-breadcrumb.interface";


@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrl: './add-category.component.scss',
  providers: [StringToSlugPipe]
})
export class AddCategoryComponent extends adminBaseMixin(Component) implements OnInit {
  // Data Form
  @ViewChild('formElement') formElement: NgForm;
  // Env Base Data
  protected readonly env = environment;
  dataForm?: FormGroup;
// Loading Control
  isLoading: boolean = false;

  // Store Data
  private readonly adminBaseUrl: string = environment.adminBaseUrl;
  // Nav Data
  navArray: NavBreadcrumb[] = [
    {name: 'Dashboard', url: `/${this.adminBaseUrl}/dashboard`},
    {name: 'Projects', url: `/${this.adminBaseUrl}/projects`},
    {name: 'All Category ', url: `/${this.adminBaseUrl}/category/all-category`},
    {name: 'Add Category', url: null},
  ];

  // Store Data
  id?: string;
  category?: Category;
  autoSlug = true;

  // Image Picker
  pickedImage = defaultUploadImage;
  pickedMobileImage = defaultUploadImage;
  pickedBannerImage = defaultUploadImage;

  // Subscriptions
  private subDataOne: Subscription;
  private subDataTwo: Subscription;
  private subDataThree: Subscription;
  private subRouteOne: Subscription;
  private subAutoSlug: Subscription;

  // Inject
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly uiService = inject(UiService);
  private readonly dialog = inject(MatDialog);
  private readonly fileUploadService = inject(FileUploadService);
  private readonly categoryService = inject(CategoryService);
  private readonly stringToSlugPipe = inject(StringToSlugPipe);


  ngOnInit(): void {
    // Init Form
    this.initDataForm();

    // GET ID FORM PARAM
    this.subRouteOne = this.activatedRoute.paramMap.subscribe((param) => {
      this.id = param.get('id');

      if (this.id) {
        this.getCategoryById();
      }
    });

    // Auto Slug
    this.autoGenerateSlug();
  }

  /**
   * FORM METHODS
   * initDataForm()
   * setFormValue()
   * onSubmit()
   */

  onDiscard() {
    if (!this.id && this.dataForm.valid) {
      this.openConfirmDialog();
    } else {
      this.router.navigate(['/', 'category', 'all-category']).then()
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
        this.router.navigate(['/', this.env.adminBaseUrl, 'users']).then();
      }
    });

  }

  private initDataForm() {
    this.dataForm = this.fb.group({
      name: [null],
    });
  }

  private setFormValue() {
    this.dataForm.patchValue(this.category);

  }

  onSubmit() {
    console.log("this.dataForm.value:::", this.dataForm.value);
    
    if (this.dataForm.invalid) {
      this.uiService.message('Please filed all the required field', 'warn');
      return;
    }
    if (!this.category) {
      this.addCategory();
    } else {
      this.updateCategoryById();
    }
  }

  /**
   * HTTP REQ HANDLE
   * getCategoryById()
   * addCategory()
   * updateCategoryById()
   */

  private getCategoryById() {

    this.subDataOne = this.categoryService.getCategoryById(this.id).subscribe({
      next: (res) => {

        if (res.data) {
          this.category = res.data;
          this.setFormValue();
        }
      },
      error: (error) => {

        console.log(error);
      },
    });
  }

  private addCategory() {

    this.subDataTwo = this.categoryService
      .addCategory(this.dataForm.value)
      .subscribe({
        next: (res) => {

          if (res.success) {
            this.uiService.message(res.message, 'success');

            this.formElement.resetForm();
            this.pickedImage = defaultUploadImage;
            this.pickedMobileImage = defaultUploadImage;

          } else {
            this.uiService.message(res.message, 'warn');
          }
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  private updateCategoryById() {

    this.subDataThree = this.categoryService
      .updateCategoryById(this.category._id, this.dataForm.value)
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
          const res = this.stringToSlugPipe.transform(d, '-')
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
   * ON DESTROY
   * ngOnDestroy()
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

    if (this.subRouteOne) {
      this.subRouteOne.unsubscribe();
    }
    if (this.subAutoSlug) {
      this.subAutoSlug.unsubscribe();
    }
  }
}
