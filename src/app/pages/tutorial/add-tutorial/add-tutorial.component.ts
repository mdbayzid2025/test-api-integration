import {Component, inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {adminBaseMixin} from "../../../mixin/admin-base.mixin";
import {FormBuilder, FormGroup, NgForm, Validators} from "@angular/forms";
import {NavBreadcrumb} from "../../../interfaces/core/nav-breadcrumb.interface";
import {Tutorial} from "../../../interfaces/common/tutorial.interface";
import {DATA_STATUS_2, THEME_CATEGORIES, THEME_SUB_CATEGORIES} from "../../../core/utils/app-data";
import {Select} from "../../../interfaces/core/select";
import {Subscription} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {UiService} from "../../../services/core/ui.service";
import {MatDialog} from "@angular/material/dialog";
import {TutorialService} from "../../../services/common/tutorial.service";
import {ConfirmDialogComponent} from "../../../shared/components/ui/confirm-dialog/confirm-dialog.component";
import {MatSelectChange} from "@angular/material/select";

@Component({
  selector: 'app-add-tutorial',
  templateUrl: './add-tutorial.component.html',
  styleUrl: './add-tutorial.component.scss'
})
export class AddTutorialComponent extends adminBaseMixin(Component) implements OnInit, OnDestroy {
  // Data Form
  @ViewChild('formElement') formElement: NgForm;
  dataForm?: FormGroup;

  // Loading Control
  isLoading: boolean = false;

  // Image Control
  pickedImages: any[] = [];

  // Nav Data
  navArray: NavBreadcrumb[] = [
    {name: 'Dashboard', url: `/dashboard`},
    {name: 'All Tutorial ', url: `/tutorial/all-tutorial`},
    {name: 'Add Tutorial', url: null},
  ];

  // Store Data
  id?: string;
  tutorial?: Tutorial;
  categories: any[] = THEME_CATEGORIES;
  subCategories: any[] = [];
  dataStatus: Select[] = DATA_STATUS_2;

  // Subscriptions
  private subDataGet: Subscription;
  private subDataAdd: Subscription;
  private subDataUpdate: Subscription;
  private subRouteParam: Subscription;

  // Inject
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly uiService = inject(UiService);
  private readonly dialog = inject(MatDialog);
  private readonly tutorialService = inject(TutorialService);


  ngOnInit(): void {
    // Init Form
    this.initDataForm();

    // GET ID FORM PARAM
    this.subRouteParam = this.activatedRoute.paramMap.subscribe((param) => {
      this.id = param.get('id');
      if (this.id) {
        this.getTutorialById();
      }
    });
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
      url: [null],
      keyword: [null],
      images: [null],
      status: ['publish'],
    });
  }

  private setFormValue() {
    this.dataForm.patchValue(this.tutorial);

    if (this.tutorial.image) {
      this.pickedImages = [this.tutorial.image];
    }

  }

  onSubmit() {
    console.log("this.dataForm.value:::", this.dataForm.value);

    if (this.dataForm.invalid) {
      this.uiService.message('Please filed all the required field', 'warn');
      return;
    }
    if (!this.tutorial) {
      this.addTutorial();
    } else {
      this.updateTutorialById();
    }
  }

  onDiscard() {
    if (this.dataForm.dirty) {
      this.openConfirmDialog();
    } else {
      this.router.navigate(['/', 'tutorial', 'all-tutorial']).then()
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
        this.router.navigate(['/tutorial']).then();
      }
    });

  }

  onPickedImage(event: any) {
    console.log('event',event)
    this.dataForm.patchValue({image: event[0]});
  }
  /**
   * HTTP REQ HANDLE
   * getTutorialById()
   * addTutorial()
   * updateTutorialById()
   */

  private getTutorialById() {
    this.subDataGet = this.tutorialService.getTutorialById(this.id).subscribe({
      next: (res) => {
        if (res.data) {
          this.tutorial = res.data;
          this.setFormValue();
        }
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  private addTutorial() {
    this.subDataAdd = this.tutorialService
      .addTutorial(this.dataForm.value)
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

  private updateTutorialById() {
    this.subDataUpdate = this.tutorialService
      .updateTutorialById(this.tutorial._id, this.dataForm.value)
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
