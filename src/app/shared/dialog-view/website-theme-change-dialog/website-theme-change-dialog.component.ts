import {Component, inject, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {NgForOf} from '@angular/common';
import {MatButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {ShopService} from '../../../services/common/shop.service';
import {FormBuilder, FormGroup, NgForm, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatError, MatFormField, MatLabel} from '@angular/material/form-field';
import {MatOption} from '@angular/material/autocomplete';
import {MatSelect} from '@angular/material/select';
import {MatCheckbox} from '@angular/material/checkbox';
import {ActivatedRoute, Router} from '@angular/router';
import {UiService} from '../../../services/core/ui.service';
import {FilterData} from '../../../interfaces/gallery/filter-data';
import {ThemeService} from '../../../services/common/theme.service';
import {Theme} from '../../../interfaces/common/theme.interface';
import {Subscription} from 'rxjs';
import {CLONE_URLS} from "../../../core/utils/app-data";
import {Select} from '../../../interfaces/core/select';

@Component({
  selector: 'app-website-theme-change-dialog',
  standalone: true,
  imports: [
    NgForOf,
    MatButton,
    MatIcon,
    ReactiveFormsModule,
    MatError,
    MatFormField,
    MatLabel,
    MatOption,
    MatSelect,
    MatCheckbox
  ],
  templateUrl: './website-theme-change-dialog.component.html',
  styleUrl: './website-theme-change-dialog.component.scss'
})
export class WebsiteThemeChangeDialogComponent implements OnInit, OnDestroy {

  // Store Data
  themes: Theme[] = [];

  // Data Form
  @ViewChild('formElement') formElement: NgForm;
  dataForm?: FormGroup;
  cloneUrls = CLONE_URLS;
  filteredCloneUrls: Select[] = CLONE_URLS;

  // Loading Control
  isLoading: boolean = false;


  // Inject
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly uiService = inject(UiService);
  private readonly dialog = inject(MatDialog);
  private readonly shopService = inject(ShopService);
  private readonly themeService = inject(ThemeService);

  // Subscriptions
  private subscriptions: Subscription[] = [];

  constructor(
    public dialogRef: MatDialogRef<WebsiteThemeChangeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  ngOnInit() {
    // Init Form
    this.initDataForm();

    // Base Data
    this.getAllTheme();
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
      theme: [null, Validators.required],
      needReset: [false],
      cloneWebUrl: [null],
    });
  }

  private setFormValue() {
    // this.dataForm.patchValue(this.shop);

  }

  onSubmit() {
    console.log("this.dataForm.value:::", this.dataForm.value);

    if (this.dataForm.invalid) {
      this.uiService.message('Please filed all the required field', 'warn');
      return;
    }

    this.changeThemeByShop(this.dataForm.value);
  }

  closeDialog() {
    this.dialogRef.close();
  }


  private getAllTheme() {
    const filterData: FilterData = {
      pagination: null,
      filter: null,
      select: {
        name: 1,
        themeStatus: 1,
        reference: 1,
      },
      sort: {createdAt: -1},
    }
    const subscription = this.themeService.getAllTheme(filterData, null)
      .subscribe({
        next: res => {
          this.themes = res.data;
        },
        error: err => {
          console.log(err)
        }
      });
    this.subscriptions.push(subscription);
  }

  private changeThemeByShop(data: any) {
    this.isLoading = true;
    const subscription = this.shopService.changeThemeByShop(this.data._id, data)
      .subscribe({
        next: res => {
          this.isLoading = false;
          console.log('versionUpdateByShop', res)
          if (res.success) {
            this.uiService.message(res.message, 'success');

          } else {
            this.uiService.message(res.message, 'warn')
          }
        },
        error: err => {
          this.isLoading = false;
          console.log(err)
        }
      });
    this.subscriptions.push(subscription);
  }

  onThemeChange(event: any): void {
    const theme = this.themes.find(f => f._id === event.value);
    if (theme) {
      this.filteredCloneUrls = this.getCloneUrlsByThemes(theme.reference);
      if (this.filteredCloneUrls.length) {
        this.dataForm.patchValue({cloneWebUrl: this.filteredCloneUrls[0].value})
      }
    }

  }

  private getCloneUrlsByThemes(themeRef: string) {
    const refs = themeRef.split(',').map(ref => ref.trim());
    return this.cloneUrls.filter(clone => refs.includes(clone.value));
  }


  /**
   * ON Destroy
   */
  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub?.unsubscribe());
  }


}
