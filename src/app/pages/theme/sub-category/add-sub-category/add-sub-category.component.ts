import {Component, inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {adminBaseMixin} from "../../../../mixin/admin-base.mixin";
import {FormBuilder, FormGroup, NgForm, Validators} from "@angular/forms";
import {NavBreadcrumb} from "../../../../interfaces/core/nav-breadcrumb.interface";
import {DATA_STATUS} from "../../../../core/utils/app-data";
import {Select} from "../../../../interfaces/core/select";
import {Subscription} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {UiService} from "../../../../services/core/ui.service";
import {MatDialog} from "@angular/material/dialog";
import {ConfirmDialogComponent} from "../../../../shared/components/ui/confirm-dialog/confirm-dialog.component";
import {FilterData} from "../../../../interfaces/gallery/filter-data";
import {ThemeCategory} from "../../../../interfaces/common/theme-category.interface";
import {ThemeSubCategory} from "../../../../interfaces/common/theme-sub-category.interface";
import {ThemeCategoryService} from "../../../../services/common/theme-category.service";
import {ThemeSubCategoryService} from "../../../../services/common/theme-sub-category.service";
import {StringToSlugPipe} from "../../../../shared/pipes/string-to-slug.pipe";

@Component({
  selector: 'app-add-sub-category',
  templateUrl: './add-sub-category.component.html',
  styleUrl: './add-sub-category.component.scss',
  providers: [StringToSlugPipe]
})
export class AddSubCategoryComponent extends adminBaseMixin(Component) implements OnInit, OnDestroy {
  // Data Form
  @ViewChild('formElement') formElement: NgForm;
  dataForm?: FormGroup;

  // Loading Control
  isLoading: boolean = false;

  // Nav Data
  navArray: NavBreadcrumb[] = [
    {name: 'Dashboard', url: `/dashboard`},
    {name: 'All SubCategory ', url: `/subCategory/all-subCategory`},
    {name: 'Add SubCategory', url: null},
  ];

  // Store Data
  id?: string;
  subCategory?: ThemeSubCategory;
  categories: ThemeCategory[] = [];
  subCategories: any[] = [];
  dataStatus: Select[] = DATA_STATUS;
  autoSlug = true;

  // Subscriptions
  private subDataGet: Subscription;
  private subDataAdd: Subscription;
  private subDataUpdate: Subscription;
  private subRouteParam: Subscription;
  private subDataFour: Subscription;
  private subAutoSlug: Subscription;
  // Inject
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly uiService = inject(UiService);
  private readonly dialog = inject(MatDialog);
  private readonly subCategoryService = inject(ThemeSubCategoryService);
  private readonly categoryService = inject(ThemeCategoryService);
  private readonly stringToSlugPipe = inject(StringToSlugPipe);

  ngOnInit(): void {
    // Init Form
    this.initDataForm();

    // GET ID FORM PARAM
    this.subRouteParam = this.activatedRoute.paramMap.subscribe((param) => {
      this.id = param.get('id');
      if (this.id) {
        this.getSubCategoryById();
      }
    });
    // Base Data
    this.getAllCategories();
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
      themeCategory: [null],
      images: [null],
      slug: [null],
      searchHints: [null],
      status: ['publish'],
    });
  }

  private setFormValue() {
    this.dataForm.patchValue(this.subCategory);

    this.dataForm.patchValue({
        ...this.subCategory,
        ...{
          themeCategory: this.subCategory.themeCategory._id,
        }
      }
    );
  }

  onSubmit() {
    console.log("this.dataForm.value:::", this.dataForm.value);

    if (this.dataForm.invalid) {
      this.uiService.message('Please filed all the required field', 'warn');
      return;
    }
    const mData = {
      ...this.dataForm.value,
      ...{
        themeCategory: {
          _id: this.dataForm.value.themeCategory,
          name: this.categories.find(f => f._id === this.dataForm.value.themeCategory).name,
          slug: this.categories.find(f => f._id === this.dataForm.value.themeCategory).slug,
        }
      }
    }
    if (!this.subCategory) {
      this.addSubCategory(mData);
    } else {
      this.updateSubCategoryById(mData);
    }
  }

  onDiscard() {
    if (this.dataForm.dirty) {
      this.openConfirmDialog();
    } else {
      this.router.navigate(['/', 'subCategory', 'all-subCategory']).then()
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
        this.router.navigate(['/subCategory']).then();
      }
    });

  }

  /**
   * HTTP REQ HANDLE
   * getSubCategoryById()
   * addSubCategory()
   * updateSubCategoryById()
   */

  private getSubCategoryById() {
    this.subDataGet = this.subCategoryService.getThemeSubCategoryById(this.id).subscribe({
      next: (res) => {
        if (res.data) {
          this.subCategory = res.data;
          this.setFormValue();
        }
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  private addSubCategory(data:any) {
    this.subDataAdd = this.subCategoryService
      .addThemeSubCategory(data)
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

  private updateSubCategoryById(data:any) {
    this.subDataUpdate = this.subCategoryService
      .updateThemeSubCategoryById(this.subCategory._id, data)
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

  private getAllCategories() {
    // Select
    const mSelect = {
      name: 1,
      slug: 1,
    }

    const filterData: FilterData = {
      pagination: null,
      filter: null,
      select: mSelect,
      sort: {name: 1}
    }
    this.subDataFour = this.categoryService.getAllCategories(filterData, null)
      .subscribe({
        next: (res => {
          this.categories = res.data;
        }),
        error: (error => {
          console.log(error);
        })
      });
  }

  /**
   * Selection Change
   * onChangeCategory()
   */
  // onChangeCategory(event: MatSelectChange) {
  //   if (event.value) {
  //     const fCat = this.categories.find(f => f.name === event.value);
  //     this.subCategories = THEME_SUB_CATEGORIES.filter(f => f.category === fCat._id)
  //   }
  // }

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
