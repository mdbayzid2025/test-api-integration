import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Title} from '@angular/platform-browser';
import {UiService} from '../../services/core/ui.service';
import {environment} from '../../../environments/environment';
import {AdminService} from '../../services/common/admin.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit, OnDestroy {

  // Basic
  readonly env = environment;
  readonly year = new Date().getFullYear();

  // Reactive Form
  dataForm: FormGroup;

  // Loading
  isLoading: boolean = false;

  // Services
  private readonly uiService = inject(UiService);
  private readonly title = inject(Title);
  private readonly adminService = inject(AdminService);
  private readonly fb = inject(FormBuilder);


  ngOnInit(): void {
    // Seo Meta Data
    this.seoMetaData();

    // Main reactive form..
    this.initDataForm();

  }

  /**
   * FORM METHODS
   * initDataForm()
   * onSubmit()
   */
  private initDataForm() {
    this.dataForm = this.fb.group({
      username: [null, Validators.required],
      password: [null, Validators.required]
    });
  }

  async onSubmit() {
    if (this.dataForm.invalid) {
      this.uiService.message('Invalid Input field!', 'warn');
      return;
    }
    // Form Data..
    const username = this.dataForm.value.username.trim().toLowerCase();
    const password = this.dataForm.value.password;

    if (username.length < 5) {
      this.uiService.message('Username must be at least 5 character!', 'warn');
      this.dataForm.controls['username'].setErrors({'incorrect': true});
      return;
    }

    if (password.length < 5) {
      this.uiService.message('Password must be at least 5 character!', 'warn');
      this.dataForm.controls['password'].setErrors({'incorrect': true});
      return;
    }

    this.isLoading = true;

    const data = {username, password};

    try {
      await this.adminService.adminLogin(data);
      this.isLoading = false;
    } catch (err) {
      if (err && err.error && err.error.error) {
        this.uiService.message(`[${err.error.error}] ${err.error.message && err.error.message.length ? err.error.message[0] : ''}`, 'warn');
      }
      this.isLoading = false;
    }

  }

  private seoMetaData() {
    // Title
    this.title.setTitle('Superadmin Login | Saleecom');
  }

  /**
   * ngOnDestroy()
   */
  ngOnDestroy() {
    this.isLoading = false;
  }

}
