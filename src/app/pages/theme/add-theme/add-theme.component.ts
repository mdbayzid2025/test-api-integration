import {Component, inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, NgForm, Validators} from "@angular/forms";
import {
  DATA_BOOLEAN,
  DATA_STATUS,
  DATA_STATUS_AVAILABILITY, PAGE_CUSTOM_OPTIONS, THEME_CUSTOM_OPTIONS,
  THEME_CUSTOM_OPTIONS_SELECT_TYPES, THEME_DATA_STATUS,
} from "../../../core/utils/app-data";
import {Theme} from "../../../interfaces/common/theme.interface";
import {Subscription} from "rxjs";
import {UiService} from "../../../services/core/ui.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ThemeService} from "../../../services/common/theme.service";
import {MatDialog} from "@angular/material/dialog";
import {adminBaseMixin} from "../../../mixin/admin-base.mixin";
import {ConfirmDialogComponent} from "../../../shared/components/ui/confirm-dialog/confirm-dialog.component";
import {NavBreadcrumb} from "../../../interfaces/core/nav-breadcrumb.interface";
import {MatSelectChange} from '@angular/material/select';
import {Select} from '../../../interfaces/core/select';
import {FilterData} from "../../../interfaces/gallery/filter-data";
import {ThemeCategoryService} from "../../../services/common/theme-category.service";
import {ThemeSubCategoryService} from "../../../services/common/theme-sub-category.service";
import {ThemeCategory} from '../../../interfaces/common/theme-category.interface';
import {ThemeSubCategory} from '../../../interfaces/common/theme-sub-category.interface';

@Component({
  selector: 'app-add-theme',
  templateUrl: './add-theme.component.html',
  styleUrl: './add-theme.component.scss'
})
export class AddThemeComponent extends adminBaseMixin(Component) implements OnInit, OnDestroy {

  // Decorator
  @ViewChild('formElement') formElement: NgForm;

  // Data Form
  dataForm?: FormGroup;

  // Store Data
  id: string;
  theme: Theme;
  categories: ThemeCategory[] = [];
  subCategories: ThemeSubCategory[] = [];
  dataStatus: Select[] = DATA_STATUS;
  themeDataStatus: Select[] = THEME_DATA_STATUS;
  forceUpdateValue: Select[] = DATA_BOOLEAN;
  dataStatusAvailability: Select[] = DATA_STATUS_AVAILABILITY;
  themeCustomOptionsStatic: Select[] = THEME_CUSTOM_OPTIONS;
  pageCustomOptionsStatic: Select[] = PAGE_CUSTOM_OPTIONS;
  themeCustomOptionsSelectTypes: Select[] = THEME_CUSTOM_OPTIONS_SELECT_TYPES;

  // Loading Control
  isLoading: boolean = false;
  showThemePriceField : boolean = false;

  // Nav Data Breadcrumb
  navArray: NavBreadcrumb[] = [
    {name: 'Dashboard', url: `/dashboard`},
    {name: 'All Theme ', url: `/theme/all-theme`},
    {name: 'Add Theme', url: null},
  ];

  // Image Control
  pickedImages: string[] = [];
  pickedImagesForValue: string[] = [];

  // Subscriptions
  private subDataGet: Subscription;
  private subParamMap: Subscription;
  private subDialogResult: Subscription;
  private subAllCategories: Subscription;
  private subAllSubCategories: Subscription;
  private subAddTheme: Subscription;
  private subUpdateTheme: Subscription;

  // Inject
  private readonly uiService = inject(UiService);
  private readonly dialog = inject(MatDialog);
  private readonly themeService = inject(ThemeService);
  private readonly themeCategoryDataService = inject(ThemeCategoryService);
  private readonly themeSubCategoryDataService = inject(ThemeSubCategoryService);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);

  ngOnInit(): void {
    this.initDataForm();
    // ParamMap Subscription
    this.subParamMap = this.activatedRoute.paramMap.subscribe((param) => {
      this.id = param.get('id');
      if (this.id) {
        this.getThemeById();
      }
    });
    this.getAllCategories();
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
      category: [null],
      subCategory: [null],
      hostDomain: [null],
      pm2path: [null],
      version: [null],
      sourcePath: [null],
      targetPath: [null],
      images: [null],
      pdf: [null],
      gitHubLink: [null],
      forceUpdate: [this.forceUpdateValue[1].value],
      previewLink: [null],
      availability: ['lived'],
      status: ['publish'],
      themeStatus: [null],
      themePrice: [null],
      reference: [null],
      releaseNote: [null],
      themeCustomOptions: this.fb.array([
        this.createDefaultOptionGroup()
      ]),
      pageCustomOptions: this.fb.array([
        this.createPageDefaultOptionGroup()
      ])
    });
  }

  private createPageDefaultOptionGroup(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      type: ['', Validators.required],
      value: this.fb.array([this.createPageDefaultValueGroup()])
    });
  }

// Default structure for a single option
  private createDefaultOptionGroup(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      type: ['', Validators.required],
      selectType: ['', Validators.required],
      value: this.fb.array([this.createDefaultValueGroup()]) // Nested values array with a default value
    });
  }

// Default structure for a single value
  private createPageDefaultValueGroup(): FormGroup {
    return this.fb.group({
      isDefault: [false],
      isLoginRequire: [false],
      name: ['', Validators.required], // Value name input
      image: [''], // Image URL input
    });
  }

  private createDefaultValueGroup(): FormGroup {
    return this.fb.group({
      isDefault: [false],
      name: ['', Validators.required], // Value name input
      image: [''], // Image URL input
      note: [''] // Optional note input
    });
  }

  // Getter for the themeCustomOptions FormArray
  get pageCustomOptions(): FormArray {
    return this.dataForm.get('pageCustomOptions') as FormArray;
  }

  get themeCustomOptions(): FormArray {
    return this.dataForm.get('themeCustomOptions') as FormArray;
  }


  // Add a new Theme Custom option dynamically
  addThemeCustomOption(): void {
    const optionGroup = this.fb.group({
      name: ['', Validators.required], // Option name input
      type: ['', Validators.required], // Option type input
      selectType: ['', Validators.required], // Select type input
      value: this.fb.array([this.createDefaultValueGroup()]) // Nested values array
    });
    this.themeCustomOptions.push(optionGroup);
  }
  // Add a new Page Custom option dynamically
  addPageCustomOption(): void {
    const optionGroup = this.fb.group({
      name: ['', Validators.required], // Option name input
      type: ['', Validators.required], // Option type input
      value: this.fb.array([this.createPageDefaultValueGroup()]) // Nested values array
    });
    this.pageCustomOptions.push(optionGroup);
  }

  addPageValueToOption(optionIndex: number): void {
    const valuesArray = this.pageCustomOptions.at(optionIndex).get('value') as FormArray;
    const valueGroup = this.fb.group({
      isDefault: [false],
      isLoginRequire: [false],
      name: ['', Validators.required], // Value name input
      image: [''], // Image URL input
    });
    valuesArray.push(valueGroup);
  }

  // Add a new value to a specific option
  addValueToOption(optionIndex: number): void {
    const valuesArray = this.themeCustomOptions.at(optionIndex).get('value') as FormArray;
    const valueGroup = this.fb.group({
      isDefault: [false],
      name: ['', Validators.required], // Value name input
      image: [''], // Image URL input
      note: [''] // Optional note input
    });
    valuesArray.push(valueGroup);
  }

  // Remove an option dynamically
  removeThemeCustomOption(optionIndex: number): void {
    this.themeCustomOptions.removeAt(optionIndex);
  }

  removePageCustomOption(optionIndex: number): void {
    this.pageCustomOptions.removeAt(optionIndex);
  }

  // Remove a specific value from an option
  removeValueFromOption(optionIndex: number, valueIndex: number): void {
    const valuesArray = this.themeCustomOptions.at(optionIndex).get('value') as FormArray;
    valuesArray.removeAt(valueIndex);
  }
  removeValueFromPageOption(optionIndex: number, valueIndex: number): void {
    const valuesArray = this.pageCustomOptions.at(optionIndex).get('value') as FormArray;
    valuesArray.removeAt(valueIndex);
  }


  onSubmit() {
    if (this.dataForm.invalid) {
      this.uiService.message('Please fill all the required fields', 'warn');
      return;
    }

    const mData = {...this.dataForm.value};

    if (this.dataForm.value.category) {
      mData.category = {
        _id: this.dataForm.value.category,
        name: this.categories.find(f => f._id === this.dataForm.value.category).name,
        slug: this.categories.find(f => f._id === this.dataForm.value.category).slug,
      };
    }

    if (this.dataForm.value.subCategory) {
      mData.subCategory = {
        _id: this.dataForm.value.subCategory,
        name: this.subCategories.find(f => f._id === this.dataForm.value.subCategory).name,
        slug: this.subCategories.find(f => f._id === this.dataForm.value.subCategory).slug,
      };
    }

    if (!this.theme) {
      this.addTheme(mData);
    } else {
      this.updateThemeById(mData);
    }
  }

  onDiscard() {
    if (this.dataForm.dirty) {
      this.openConfirmDialog();
    } else {
      this.router.navigate(['/', 'theme', 'all-theme']).then();
    }
  }

  private setFormValue() {
    this.dataForm.patchValue(this.theme);

    if (this.theme.category) {
      this.dataForm.patchValue({
        category: this.theme.category._id,
      });
    }

    if (this.theme.subCategory) {
      this.dataForm.patchValue({
        subCategory: this.theme.subCategory._id,
      });
    }

    if (this.theme?.images?.length) {
      this.pickedImages = this.theme?.images;
    }

    if (this.theme?.pageCustomOptions?.length) {
      this.pageCustomOptions.clear()
      this.pageCustomOptionsData(this.theme?.pageCustomOptions)
    }

    if (this.theme?.themeCustomOptions?.length) {
      this.themeCustomOptions.clear()
      this.themeCustomOptionsData(this.theme?.themeCustomOptions)
    }

    // Get Sub Category By Category
    if (this.theme.category) {
      this.getAllSubCategories({'themeCategory.slug': this.theme.category.slug});
    }
  }


  // Patch form with API data

  pageCustomOptionsData(data: any[]): void {
    data.forEach(option => {
      const optionGroup = this.fb.group({
        name: [option.name || '', Validators.required],
        type: [option.type || '', Validators.required],
        value: this.fb.array(
          option.value?.map((val: any) =>
            this.createPageValueGroup(val)) || []
        )
      });
      this.pageCustomOptions.push(optionGroup);
    });
  }

  themeCustomOptionsData(data: any[]): void {
    data.forEach(option => {
      const optionGroup = this.fb.group({
        name: [option.name || '', Validators.required],
        type: [option.type || '', Validators.required],
        selectType: [option.selectType || '', Validators.required],
        value: this.fb.array(
          option.value?.map((val: any) =>
            this.createValueGroup(val)) || []
        )
      });
      this.themeCustomOptions.push(optionGroup);
    });
  }

  // Create a FormGroup for individual values
  createPageValueGroup(value: any): FormGroup {
    this.pickedImagesForValue = value.image
    return this.fb.group({
      isDefault: [value.isDefault || false],
      isLoginRequire: [value.isLoginRequire || false],
      name: [value.name || '', Validators.required],
      image: [value.image || ''],
    });
  }
  createValueGroup(value: any): FormGroup {
    this.pickedImagesForValue = value.image
    return this.fb.group({
      isDefault: [value.isDefault || false],
      name: [value.name || '', Validators.required],
      image: [value.image || ''],
      note: [value.note || '']
    });
  }

  /**
   * SELECTION CHANGE
   * onChangeCategory()
   */
  onChangeCategory(event: MatSelectChange) {
    if (event.value) {
      const fCat = this.categories.find(f => f._id === event.value);
      this.getAllSubCategories({'themeCategory.slug': fCat.slug});
    }
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
    this.subDialogResult = dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.router.navigate(['/theme']).then();
      }
    });
  }

  onPickedImage(event: any) {
    this.dataForm.patchValue({images: event});
  }

  onPickedPageImageForValue(event: any, i: number, j: number) {
    const valueArray = this.dataForm.get('pageCustomOptions') as FormArray;
    const optionGroup = valueArray.at(i) as FormGroup;
    const valuesFormArray = optionGroup.get('value') as FormArray;
    valuesFormArray.at(j).patchValue({image: event});
  }

  onPickedImageForValue(event: any, i: number, j: number) {
    const valueArray = this.dataForm.get('themeCustomOptions') as FormArray;
    const optionGroup = valueArray.at(i) as FormGroup;
    const valuesFormArray = optionGroup.get('value') as FormArray;
    valuesFormArray.at(j).patchValue({image: event});
  }

  getPageImageNestedArray(i: number, j: number) {
    const valueArray = this.dataForm.get('pageCustomOptions') as FormArray;
    const optionGroup = valueArray.at(i) as FormGroup;
    const valuesFormArray = optionGroup.get('value') as FormArray;
    const image = valuesFormArray.at(j).value.image;
    if (image) {
      return [image]
    } else {
      return [];
    }
  }

  getImageNestedArray(i: number, j: number) {
    const valueArray = this.dataForm.get('themeCustomOptions') as FormArray;
    const optionGroup = valueArray.at(i) as FormGroup;
    const valuesFormArray = optionGroup.get('value') as FormArray;
    const image = valuesFormArray.at(j).value.image;
    if (image) {
      return [image]
    } else {
      return [];
    }
  }


  /**
   * HTTP REQ HANDLE
   * getThemeById()
   * getAllSubCategories()
   * addTheme()
   * updateThemeById()
   * getAllCategories()
   */
  private getThemeById() {
    this.subDataGet = this.themeService.getThemeById(this.id).subscribe({
      next: (res) => {
        if (res.data) {
          this.theme = res.data;
          this.setFormValue();
        }
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  private getAllSubCategories(filter: any) {
    const mSelect = {name: 1, slug: 1};

    const filterData: FilterData = {
      pagination: null,
      filter: filter,
      select: mSelect,
      sort: {name: 1}
    };

    this.subAllSubCategories = this.themeSubCategoryDataService.getAllThemeSubCategories(filterData, null)
      .subscribe({
        next: res => {
          this.subCategories = res.data;
        },
        error: error => {
          console.log(error);
        }
      });
  }

  private addTheme(data: any) {
    this.subAddTheme = this.themeService.addTheme(data)
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

  private updateThemeById(data: any) {
    this.subUpdateTheme = this.themeService.updateThemeById(this.theme._id, data)
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
    const mSelect = {name: 1, slug: 1};

    const filterData: FilterData = {
      pagination: null,
      filter: null,
      select: mSelect,
      sort: {name: 1}
    };

    this.subAllCategories = this.themeCategoryDataService.getAllCategories(filterData, null)
      .subscribe({
        next: res => {
          this.categories = res.data;
        },
        error: error => {
          console.log(error);
        }
      });
  }

  /**
   * ON Destroy
   */
  ngOnDestroy() {
    this.subDataGet?.unsubscribe();
    this.subParamMap?.unsubscribe();
    this.subDialogResult?.unsubscribe();
    this.subAllCategories?.unsubscribe();
    this.subAllSubCategories?.unsubscribe();
    this.subAddTheme?.unsubscribe();
    this.subUpdateTheme?.unsubscribe();
  }

  onSelectPageType(event: MatSelectChange, i: number) {
    const fData = this.pageCustomOptionsStatic.find(f => f.value === event.value);
    const valueArray = this.dataForm.get('pageCustomOptions') as FormArray;
    valueArray.at(i).patchValue({name: fData.viewValue});
  }

  onSelectType(event: MatSelectChange, i: number) {
    const fData = this.themeCustomOptionsStatic.find(f => f.value === event.value);
    const valueArray = this.dataForm.get('themeCustomOptions') as FormArray;
    valueArray.at(i).patchValue({name: fData.viewValue});
  }

  onThemeStatusChange(event: any): void {
    this.showThemePriceField = true;
    // Check if the selected themeStatus is a specific value (e.g., 'active' or 'inactive')
    // if (event.value === 'active') {
    //   this.showThemePriceField = true;
    // } else {
    //   this.showThemePriceField = false;
    // }
  }
}
