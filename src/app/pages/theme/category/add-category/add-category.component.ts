import {Component, inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {adminBaseMixin} from "../../../../mixin/admin-base.mixin";
import {FormBuilder, FormGroup, NgForm, Validators} from "@angular/forms";
import {NavBreadcrumb} from "../../../../interfaces/core/nav-breadcrumb.interface";
import {ThemeCategory} from "../../../../interfaces/common/theme-category.interface";
import {DATA_STATUS, THEME_CATEGORIES, THEME_SUB_CATEGORIES} from "../../../../core/utils/app-data";
import {Select} from "../../../../interfaces/core/select";
import {Subscription} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {UiService} from "../../../../services/core/ui.service";
import {MatDialog} from "@angular/material/dialog";
import {ThemeCategoryService} from "../../../../services/common/theme-category.service";
import {ConfirmDialogComponent} from "../../../../shared/components/ui/confirm-dialog/confirm-dialog.component";
import {MatSelectChange} from "@angular/material/select";
import {StringToSlugPipe} from "../../../../shared/pipes/string-to-slug.pipe";

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrl: './add-category.component.scss',
  providers: [StringToSlugPipe]
})
export class AddCategoryComponent extends adminBaseMixin(Component) implements OnInit, OnDestroy {
  // Data Form
  @ViewChild('formElement') formElement: NgForm;
  dataForm?: FormGroup;

  // Loading Control
  isLoading: boolean = false;
  autoSlug = true;

  // Nav Data
  navArray: NavBreadcrumb[] = [
    {name: 'Dashboard', url: `/dashboard`},
    {name: 'All Category ', url: `/category/all-category`},
    {name: 'Add Category', url: null},
  ];

  // Store Data
  id?: string;
  category?: ThemeCategory;
  categories: any[] = THEME_CATEGORIES;
  subCategories: any[] = [];
  dataStatus: Select[] = DATA_STATUS;

  // Subscriptions
  private subDataGet: Subscription;
  private subDataAdd: Subscription;
  private subDataUpdate: Subscription;
  private subRouteParam: Subscription;
  private subAutoSlug: Subscription;
  // Inject
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly uiService = inject(UiService);
  private readonly dialog = inject(MatDialog);
  private readonly categoryService = inject(ThemeCategoryService);
  private readonly stringToSlugPipe = inject(StringToSlugPipe);


  ngOnInit(): void {
    // Init Form
    this.initDataForm();

    // GET ID FORM PARAM
    this.subRouteParam = this.activatedRoute.paramMap.subscribe((param) => {
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
   * onDiscard()
   */
  private initDataForm() {
    this.dataForm = this.fb.group({
      name: [null, Validators.required],
      image: [null],
      slug: [null],
      status: ['publish'],
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

  onDiscard() {
    if (this.dataForm.dirty) {
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
        this.router.navigate(['/category']).then();
      }
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
   * HTTP REQ HANDLE
   * getCategoryById()
   * addCategory()
   * updateCategoryById()
   */

  private getCategoryById() {
    this.subDataGet = this.categoryService.getThemeCategoryById(this.id).subscribe({
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
    this.subDataAdd = this.categoryService
      .addThemeCategory(this.dataForm.value)
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

  private updateCategoryById() {
    this.subDataUpdate = this.categoryService
      .updateThemeCategoryById(this.category._id, this.dataForm.value)
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
   * Selection Change
   * onChangeCategory()
   */
  onChangeCategory(event: MatSelectChange) {
    if (event.value) {
      const fCat = this.categories.find(f => f.name === event.value);
      this.subCategories = THEME_SUB_CATEGORIES.filter(f => f.category === fCat._id)
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
  }
}
