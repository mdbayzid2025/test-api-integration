import { CommonModule } from "@angular/common";
import {Component, Inject, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { Admin } from "../../../interfaces/common/admin.interface";

@Component({
  selector: 'app-payment-instruction-dialog',
  templateUrl: './payment-instruction-dialog.component.html',
  styleUrl: './payment-instruction-dialog.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ]
})
export class PaymentInstructionDialogComponent implements OnInit {
  form: FormGroup;
  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<PaymentInstructionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { admin: Admin; paymentInstructions: string, minWithdrawAmount: number }
  ) {
    this.form = this.fb.group({
      paymentInstructions: ['', Validators.required],
      minWithdrawAmount: [null, [Validators.required, Validators.min(0.01)]],
    });
  }


  ngOnInit(): void {
    this.form.patchValue({
      paymentInstructions: this.data?.admin?.paymentInstructions,
      minWithdrawAmount:   this.data?.admin?.minWithdrawAmount
    });
  }

  save() {
    if (this.form.valid) {
      this.dialogRef.close({
        adminId: this.data.admin._id,
        paymentInstructions:  this.form.value.paymentInstructions,
        minWithdrawAmount:    this.form.value.minWithdrawAmount
      });
    }
  }

  cancel() {
    this.dialogRef.close();
  }
}
