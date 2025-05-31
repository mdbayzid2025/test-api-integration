import {Component, inject, OnInit, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, NgForm, Validators} from "@angular/forms";
import {Subscription} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {UiService} from "../../../services/core/ui.service";
import {DISCOUNT_TYPES} from "../../../core/utils/app-data";
import {Select} from "../../../interfaces/core/select";
import {MatDialog} from "@angular/material/dialog";
import {AddCategoryComponent} from "../catalog-popup/add-category/add-category.component";
import {AllImagesDialogComponent} from "../../gallery/image/all-images-dialog/all-images-dialog.component";
import {Category} from "../../../interfaces/common/category.interface";
import {StringToSlugPipe} from "../../../shared/pipes/string-to-slug.pipe";
import {CategoryService} from "../../../services/common/category.service";
import {UtilsService} from "../../../services/core/utils.service";
import {ProductService} from "../../../services/common/product.service";
import {Product} from "../../../interfaces/common/product.interface";
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";
import {ChildCategory} from "../../../interfaces/common/child-category.interface";
import {Brand} from "../../../interfaces/common/brand.interface";
import {MatSelectChange} from "@angular/material/select";
import {Gallery} from "../../../interfaces/gallery/gallery.interface";
import {SubCategory} from "../../../interfaces/common/sub-category.interface";
import {FilterData} from "../../../interfaces/gallery/filter-data";
import {Variation} from "../../../interfaces/common/variation.interface";
import {Tag} from "../../../interfaces/common/tag.interface";
import {ChildCategoryService} from "../../../services/common/child-category.service";
import {TagService} from "../../../services/common/tag.service";
import {BrandService} from "../../../services/common/brand.service";
import {SubCategoryService} from "../../../services/common/sub-category.service";
import {VariationService} from "../../../services/common/variation.service";
import {AddTagComponent} from "../catalog-popup/add-tag/add-tag.component";
import {AddBrandComponent} from "../catalog-popup/add-brand/add-brand.component";
import {AddChildCategoryComponent} from "../catalog-popup/add-child-category/add-child-category.component";
import {AddSubCategoryComponent} from "../catalog-popup/add-sub-category/add-sub-category.component";

@Component({
  selector: 'app-add-product-new',
  templateUrl: './add-product-new.component.html',
  styleUrl: './add-product-new.component.scss',
  providers: [StringToSlugPipe]
})
export class AddProductNewComponent implements OnInit {
  // ViewChild
  @ViewChild('formElement') formElement: NgForm;

  // Form Data
  dataForm?: FormGroup;
  discountTypes: Select[] = DISCOUNT_TYPES;
  isShowInfo: Boolean = false;

  // Image
  chooseImage: string[] = [];

  // Store Data
  categories: Category[] = [];
  subCategories: SubCategory[] = [];
  childCategories: ChildCategory[] = [];
  brands: Brand[] = [];
  tags: Tag[] = [];
  id?: string;
  product?: Product;
  variations: Variation[] = [];
  isEnableVariation2: boolean = false;

  // Form Arrays
  specificationDataArray?: FormArray;
  variationOptionsDataArray?: FormArray;
  variation2OptionsDataArray?: FormArray;
  variationListDataArray?: FormArray;


  // Subscriptions
  private subDataOne: Subscription;
  private subDataTwo: Subscription;
  private subDataThree: Subscription;
  private subDataFour: Subscription;
  private subDataFive: Subscription;
  private subDataSix: Subscription;
  private subDataSeven: Subscription;
  private subDataEight: Subscription;
  private subAutoSlug: Subscription;

  // Inject Services
  private readonly fb = inject(FormBuilder);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly uiService = inject(UiService);
  private readonly dialog = inject(MatDialog);
  private readonly variationService = inject(VariationService);
  private readonly stringToSlugPipe = inject(StringToSlugPipe);
  private readonly tagService = inject(TagService);
  private readonly brandService = inject(BrandService);
  private readonly childCategoryService = inject(ChildCategoryService);
  private readonly subCategoryService = inject(SubCategoryService);
  private readonly categoryService = inject(CategoryService);
  private readonly utilsService = inject(UtilsService);
  private readonly productService = inject(ProductService);


  ngOnInit(): void {
    // Init Form
    this.initDataForm();

    // GET ID FORM PARAM
    this.activatedRoute.paramMap.subscribe((param) => {
      this.id = param.get('id');

      if (this.id) {
        this.getProductById();
      }
    });

    // Auto Slug
    this.autoGenerateSlug();

    // Base Data
    this.getAllCategories();
    this.getAllBrands();
    this.getAllTags();
    this.getAllVariations();
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
      autoSlug: [true],
      sameVariantValue: [true],
      resetForm: [false],
      name: [null, Validators.required],
      slug: [null],
      description: [null],
      costPrice: [null],
      salePrice: [null],
      sku: [null],
      hasTax: [null],
      tax: [null],
      parentSku: [null],
      emiMonth: [null],
      discountType: [null],
      discountAmount: [null],
      images: [null],
      quantity: [null],
      productKeyword: [null],
      trackQuantity: [null],
      seoTitle: [null],
      seoDescription: [null],
      seoKeywords: [null],
      category: [null, Validators.required],
      subCategory: [null],
      childCategory: [null],
      brand: [null],
      tags: [null],
      earnPoint: [null],
      pointType: [null],
      pointValue: [null],
      redeemPoint: [null],
      redeemType: [null],
      redeemValue: [null],
      status: ['publish', Validators.required],
      videoUrl: [null],
      unit: [null],
      specifications: this.fb.array([]),
      // Variations
      isOverseas: [false],
      isVariation: [null],
      variation: [null],
      variationOptions: this.fb.array([
        this.createStringElement()
      ]),
      variation2: [null],
      variation2Options: this.fb.array([]),
      variationList: this.fb.array([]),

    });
    this.specificationDataArray = this.dataForm.get('specifications') as FormArray;
    this.variationOptionsDataArray = this.dataForm.get('variationOptions') as FormArray;
    this.variation2OptionsDataArray = this.dataForm.get('variation2Options') as FormArray;
    this.variationListDataArray = this.dataForm.get('variationList') as FormArray;
  }


  private setFormValue() {
    this.dataForm.patchValue({
        ...this.product,
        ...{
          category: this.product.category._id
        }
      }
    );

    if (this.product.brand) {
      this.dataForm.patchValue({
        brand: this.product.brand._id,
      })
    }

    if (this.product.productKeyword) {
      this.dataForm.patchValue({productKeyword: this.product.productKeyword})
    }

    if (this.product.subCategory) {
      this.dataForm.patchValue({
        subCategory: this.product.subCategory._id,
      })
    }

    if (this.product.childCategory) {
      this.dataForm.patchValue({
        childCategory: this.product.childCategory._id,
      })
    }

    // Tags
    if (this.product.tags && this.product.tags.length) {
      this.dataForm.patchValue({
        tags: this.product.tags.map(m => m._id)
      })
    }


    // Variations
    if (this.product?.isVariation) {

      this.isEnableVariation2 = true;

      (this.dataForm?.get('variationOptions') as FormArray).removeAt(0);
      this.product.variationOptions.forEach((f: any) => {
        const ctrl = this.fb.control(f, Validators.required);
        (this.dataForm?.get('variationOptions') as FormArray).push(ctrl);
      });

      this.product.variation2Options.forEach((f: any) => {
        const ctrl = this.fb.control(f, Validators.required);
        (this.dataForm?.get('variation2Options') as FormArray).push(ctrl);
      });

      this.product.variationList.map(m => {
        const f = this.fb.group({
          name: [m.name, Validators.required],
          salePrice: [m.salePrice, Validators.required],
          quantity: [m.quantity],
          image: [m.image],
          sku: [m.sku],
          discountType: [m.discountType],
          discountAmount: [m.discountAmount],
          trackQuantity: [m.trackQuantity],
        });
        (this.dataForm?.get('variationList') as FormArray).push(f);
      });

    }


    // Set Image
    if (this.product.images && this.product.images.length) {
      this.chooseImage = this.product.images;
    }
    // Get Sub Category By Category
    if (this.product.category) {
      this.getSubCategoriesByCategoryId(this.product.category._id);
    }
    if (this.product.subCategory) {
      this.getChildCategoriesBySubCategoryId(this.product.subCategory._id);
    }
  }

  onAddNewSpecifications() {
    const f = this.fb.group({
      name: [null, Validators.required],
      value: [null, Validators.required]
    });
    (this.dataForm?.get('specifications') as FormArray).push(f);
  }


  onSubmit() {
    if (this.dataForm.invalid) {
      this.uiService.message('Please filed all the required field', 'warn');
      return;
    }

    // console.log('this.dataForm', this.dataForm.value);
    const mData = {
      ...this.dataForm.value,
      ...{
        category: {
          _id: this.dataForm.value.category,
          name: this.categories.find(f => f._id === this.dataForm.value.category).name,
          slug: this.categories.find(f => f._id === this.dataForm.value.category).slug,
        }
      }
    }

    if (this.dataForm.value.subCategory) {
      mData.subCategory = {
        _id: this.dataForm.value.subCategory,
        name: this.subCategories.find(f => f._id === this.dataForm.value.subCategory).name,
        slug: this.subCategories.find(f => f._id === this.dataForm.value.subCategory).slug,
      }
    }

    if (this.dataForm.value.childCategory) {
      mData.childCategory = {
        _id: this.dataForm.value.childCategory,
        name: this.childCategories.find(f => f._id === this.dataForm.value.childCategory).name,
        slug: this.childCategories.find(f => f._id === this.dataForm.value.childCategory).slug,
      }
    }

    if (this.dataForm.value.brand) {
      mData.brand = {
        _id: this.dataForm.value.brand,
        name: this.brands.find(f => f._id === this.dataForm.value.brand).name,
        slug: this.brands.find(f => f._id === this.dataForm.value.brand).slug,
      }
    }

    if (this.dataForm.value.productKeyword && !this.product?.productKeyword) {
      let str = this.dataForm.value.productKeyword;
      let array = str.split(",");
      mData.productKeyword = array;
    }

    if (this.dataForm.value.productKeyword && this.product?.productKeyword) {
      mData.productKeyword = this.dataForm.value.productKeyword;
    }

    // if (this.dataForm.value.hasVariations) {
    //   const filteredVariations = this.variations.filter((el) => {
    //     return this.dataForm.value.variations.some((f) => {
    //       return f === el._id;
    //     });
    //   });
    //
    //   mData.variations = filteredVariations;
    // }
    if (this.product) {
      this.updateProductById(mData);
    } else {
      this.addProduct({...mData, ...{rating: 0, approval: 'approved'}});

    }

  }

  /**
   * HTTP REQ HANDLE
   * getAllCategories
   * getAllBrands
   * getAllTags
   * getAllVariations()
   * getSubCategoriesByCategoryId()
   * getProductById()
   * addProduct()
   * updateProductById()
   */
  private getAllCategories() {

    // Select
    const mSelect = {
      name: 1,
      slug: 1
    }

    const filterData: FilterData = {
      pagination: null,
      filter: null,
      select: mSelect,
      sort: {name: 1}
    }


    this.subDataFour = this.categoryService.getAllCategories(filterData, null)
      .subscribe({
        next: (res) => {
        this.categories = res.data;
      }, error: (error) => {
          console.log(error);
        },
      });
  }

  private getAllBrands() {
    // Select
    const mSelect = {
      name: 1,
      slug: 1
    }

    const filterData: FilterData = {
      pagination: null,
      filter: null,
      select: mSelect,
      sort: {name: 1}
    }


    this.subDataFive = this.brandService.getAllBrands(filterData, null)
      .subscribe({
        next: (res) => {
        this.brands = res.data;
      }, error: (error) => {
          console.log(error);
        },
      });
  }

  private getAllTags() {
    // Select
    const mSelect = {
      name: 1,
      slug: 1
    }

    const filterData: FilterData = {
      pagination: null,
      filter: null,
      select: mSelect,
      sort: {name: 1}
    }


    this.subDataSix = this.tagService.getAllTags(filterData, null)
      .subscribe({
        next: (res) => {
        this.tags = res.data;
      }, error: (error) => {
          console.log(error);
        },
      });
  }

  private getAllVariations() {

    // Select
    const mSelect = {
      name: 1,
      values: 1,
    }

    const filterData: FilterData = {
      pagination: null,
      filter: null,
      select: mSelect,
      sort: {name: 1}
    }

    this.subDataEight = this.variationService.getAllVariations(filterData, null)
      .subscribe({
        next: (res) => {
          this.variations = res.data;
        }, error: (error) => {
          console.log(error);
        },
      });
  }

  private getSubCategoriesByCategoryId(categoryId: string) {
    const select = 'name category slug'
    this.subDataSeven = this.subCategoryService.getSubCategoriesByCategoryId(categoryId, select)
      .subscribe({
        next: (res) => {
          this.subCategories = res.data;
        }, error: (error) => {
          console.log(error);
        },
      });
  }

  private getChildCategoriesBySubCategoryId(categoryId: string) {
    const select = 'name slug'
    this.subDataSeven = this.childCategoryService.getChildCategoriesByCategoryId(categoryId, select)
      .subscribe({
        next: (res) => {
          this.childCategories = res.data;
        }, error: (error) => {
          console.log(error);
        },
      });
  }

  private getProductById() {
    // const select = 'name email username phoneNo gender role permissions hasAccess'
    this.subDataTwo = this.productService.getProductById(this.id)
      .subscribe({
        next: (res) => {
          if (res.success) {
            this.product = res.data;
            this.setFormValue();
          }
        }, error: (error) => {
          console.log(error);
        },
      });
  }

  private addProduct(data: any) {
    // this.vendorID = this.vendorService.getVendorId(),

    this.subDataOne = this.productService.addProduct({...data})
      .subscribe({
        next: (res) => {
          if (res.success) {
            this.uiService.message(res.message, 'success');
            if (this.dataForm.value.resetForm) {
              this.formElement.resetForm();
              // this.clearFormArray(this.variationsDataArray);
            }
            this.chooseImage = [];

          } else {
            this.uiService.message(res.message, 'warn');
          }
        }, error: (error) => {
          console.log(error);
        },
      });
  }

  private updateProductById(data: any) {
    this.subDataThree = this.productService.updateProductById(this.product._id, data)
      .subscribe({
        next: (res) => {
          if (res.success) {
            this.uiService.message(res.message, 'success');
          } else {
            this.uiService.message(res.message, 'warn');
          }
        }, error: (error) => {
          console.log(error);
        },
      });
  }

  public setDiscountZero() {
    this.dataForm.patchValue({discountAmount: null})
    this.dataForm.patchValue({discountType: null})
  }

  /**
   * DUG & DROP IMAGE REARRANGE
   */

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.chooseImage, event.previousIndex, event.currentIndex);
  }

  /**
   * REMOVE SELECTED IMAGE
   */
  removeSelectImage(s: string) {
    const index = this.chooseImage.findIndex(x => x === s);
    this.chooseImage.splice(index, 1);
  }


  /**
   * ON CATEGORY SELECT
   */
  onCategorySelect(event: MatSelectChange) {
    if (event.value) {
      this.getSubCategoriesByCategoryId(event.value);
    }
  }

  onSubCategorySelect(event: MatSelectChange) {
    if (event.value) {
      this.getChildCategoriesBySubCategoryId(event.value);
    }
  }


  /**
   * GET IMAGE DATA FROM STATE
   */
  private patchPickedImagesUnique(images: Gallery[]) {
    if (this.chooseImage && this.chooseImage.length > 0) {
      const nImages = images.map(m => m.url);
      this.chooseImage = this.utilsService.mergeArrayString(nImages, this.chooseImage);
    } else {
      this.chooseImage = images.map(m => m.url);
    }
    this.dataForm.patchValue(
      {images: this.chooseImage}
    );
  }

  /**
   * VARIATIONS LOGICS
   * onAddNewVariationObject()
   * createVariationsOptions()
   * removeVariationImage()
   * onCheckEnableVariations()
   */


  /**
   * OPEN COMPONENT DIALOG
   */

  public openGalleryDialog() {
    const dialogRef = this.dialog.open(AllImagesDialogComponent, {
      data: {type: 'multiple', count: this.chooseImage.length ? (10 - this.chooseImage.length) : 10},
      panelClass: ['theme-dialog', 'full-screen-modal-lg'],
      width: '100%',
      minHeight: '100%',
      autoFocus: false,
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        if (dialogResult.data && dialogResult.data.length > 0) {
          this.patchPickedImagesUnique(dialogResult.data);
          // this.progress();
        }
      }
    });
  }

  public openVariationGalleryDialog(index: number) {
    const dialogRef = this.dialog.open(AllImagesDialogComponent, {
      data: {type: 'multiple', count: 1},
      panelClass: ['theme-dialog', 'full-screen-modal-lg'],
      width: '100%',
      minHeight: '100%',
      autoFocus: false,
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        if (dialogResult.data && dialogResult.data.length > 0) {
          this.variationListDataArray.at(index).patchValue({image: dialogResult.data[0].url})
        }
      }
    });
  }

  /**
   * LOGICAL PART
   * autoGenerateSlug()
   */
  autoGenerateSlug() {
    if (this.dataForm.get('autoSlug').value === true) {
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


  onToggleVariation2(type: 'add' | 'remove') {
    this.isEnableVariation2 = !this.isEnableVariation2;
    if (type === 'remove') {
      let removed = 0;
      this.dataForm.value.variation2Options.forEach((v, index) => {
        this.dataForm.value.variationList.forEach((item, i) => {
          const position = item.name.search(v)
          if (position !== -1) {
            (this.dataForm?.get('variationList') as FormArray).removeAt(i - removed);
            removed += 1
          }
        })
      });
      this.dataForm.patchValue({variation2: null})
      this.variation2OptionsDataArray.clear();
    } else {
      this.onAddNewFormString('variation2Options');
    }
  }

  onCreateVariationFormArray() {
    // Reset First
    this.variationListDataArray.clear();
    if (this.dataForm.value.variation2Options.length) {
      this.dataForm.value.variationOptions.forEach(v1 => {
        this.dataForm.value.variation2Options.forEach(v2 => {
          const f = this.fb.group({
            name: [`${v1}, ${v2}`, Validators.required],
            sku: [this.dataForm.value.sameVariantValue ? this.dataForm.value.sku : null, Validators.required],
            salePrice: [this.dataForm.value.sameVariantValue ? this.dataForm.value.salePrice : null, Validators.required],
            discountType: [this.dataForm.value.sameVariantValue ? this.dataForm.value.discountType : null],
            discountAmount: [this.dataForm.value.sameVariantValue ? this.dataForm.value.discountAmount : null],
            quantity: [this.dataForm.value.sameVariantValue ? this.dataForm.value.quantity : null],
            trackQuantity: [null],
            image: [null],
          });
          (this.dataForm?.get('variationList') as FormArray).push(f);
        })
      })
    } else {
      this.dataForm.value.variationOptions.forEach(v1 => {
        const f = this.fb.group({
          name: [v1, Validators.required],
          sku: [null],
          salePrice: [null, Validators.required],
          discountType: [null],
          discountAmount: [null],
          quantity: [null],
          trackQuantity: [null],
          image: [null],
        });
        (this.dataForm?.get('variationList') as FormArray).push(f);
      })
    }
  }

  onPickImage(index: number) {
    // this.variationListDataArray.at(index).patchValue({image: 'https://cdn.softlabit.com'})
    this.openVariationGalleryDialog(index)
  }

  /**
   * Variation Click Events
   * onToggleVariation()
   */
  onToggleVariation(isEnableVariation: boolean) {
    this.dataForm.patchValue({isVariation: isEnableVariation});
    if (isEnableVariation) {
      // this.dataForm.patchValue({
      //   salePrice: null,
      //   discountType: null,
      //   discountAmount: null,
      //   quantity: null,
      //   trackQuantity: null
      // })
    } else {
      this.dataForm.patchValue({variation: null, variation2: null})
      this.variation2OptionsDataArray.clear();
      this.variationOptionsDataArray.clear();
      this.variationListDataArray.clear();
    }
  }


  createStringElement() {
    return this.fb.control('');
  }

  onAddNewFormString(name: 'variationOptions' | 'variation2Options') {
    (this.dataForm?.get(name) as FormArray).push(this.createStringElement());
  }

  removeFormArrayField(name: 'variationOptions' | 'variation2Options' | 'specifications' | 'variationList', index: number) {

    let removed = 0
    this.dataForm.value.variationList.forEach((item, i) => {
      if (name === 'variation2Options') {
        const v2Value = (this.dataForm?.get('variation2Options') as FormArray).at(index).value;
        const position = item.name.search(v2Value)
        if (position !== -1) {
          (this.dataForm?.get('variationList') as FormArray).removeAt(i - removed);
          removed += 1
        }
      }

      if (name === 'variationOptions') {
        const vValue = (this.dataForm?.get('variationOptions') as FormArray).at(index).value;
        const position = item.name.search(vValue)
        if (position !== -1) {
          (this.dataForm?.get('variationList') as FormArray).removeAt(i - removed);
          removed += 1
        }
      }
    });
    (this.dataForm?.get(name) as FormArray).removeAt(index);
  }


  /**
   * DIALOG VIEW COMPONENT
   * openCategoryDialog()
   * openSubCategoryDialog()
   * openChildCategoryDialog()
   * openBrandDialog()
   * openTagDialog()
   */
  public openCategoryDialog(event: MouseEvent) {
    event.stopPropagation();
    const dialogRef = this.dialog.open(AddCategoryComponent, {
      panelClass: ['theme-dialog', 'no-padding-dialog'],
      width: '98%',
      maxWidth: '500px',
      height: 'auto',
      maxHeight: '100vh',
      autoFocus: false,
      disableClose: false
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult && dialogResult.data) {
      }
    });
  }


  public openSubCategoryDialog(event: MouseEvent) {
    event.stopPropagation();
    const dialogRef = this.dialog.open(AddSubCategoryComponent, {
      panelClass: ['theme-dialog', 'no-padding-dialog'],
      width: '98%',
      maxWidth: '500px',
      height: 'auto',
      maxHeight: '100vh',
      autoFocus: false,
      disableClose: false
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult && dialogResult.data) {
      }
    });
  }

  public openChildCategoryDialog(event: MouseEvent) {
    event.stopPropagation();
    const dialogRef = this.dialog.open(AddChildCategoryComponent, {
      panelClass: ['theme-dialog', 'no-padding-dialog'],
      width: '98%',
      maxWidth: '500px',
      height: 'auto',
      maxHeight: '100vh',
      autoFocus: false,
      disableClose: false
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult && dialogResult.data) {
      }
    });
  }

  public openBrandDialog(event: MouseEvent) {
    event.stopPropagation();
    const dialogRef = this.dialog.open(AddBrandComponent, {
      panelClass: ['theme-dialog', 'no-padding-dialog'],
      width: '98%',
      maxWidth: '500px',
      height: 'auto',
      maxHeight: '100vh',
      autoFocus: false,
      disableClose: false
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult && dialogResult.data) {
      }
    });
  }

  public openTagDialog(event: MouseEvent) {
    event.stopPropagation();
    const dialogRef = this.dialog.open(AddTagComponent, {
      panelClass: ['theme-dialog', 'no-padding-dialog'],
      width: '98%',
      maxWidth: '500px',
      height: 'auto',
      maxHeight: '100vh',
      autoFocus: false,
      disableClose: false
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult && dialogResult.data) {
      }
    });
  }

  addMoreInfo() {
    this.isShowInfo = !this.isShowInfo;
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
    if (this.subDataFour) {
      this.subDataFour.unsubscribe();
    }
    if (this.subDataFive) {
      this.subDataFive.unsubscribe();
    }
    if (this.subDataSix) {
      this.subDataSix.unsubscribe();
    }
    if (this.subDataSeven) {
      this.subDataSeven.unsubscribe();
    }
    if (this.subAutoSlug) {
      this.subAutoSlug.unsubscribe();
    }
  }

  getStatus(data: string) {
    this.dataForm.patchValue({status: data})
  }
}
