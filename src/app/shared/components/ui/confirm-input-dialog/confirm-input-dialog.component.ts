import {Component, inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {MatFormField} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {FormsModule} from '@angular/forms';
import {UiService} from '../../../../services/core/ui.service';

@Component({
  selector: 'app-confirm-input-dialog',
  templateUrl: './confirm-input-dialog.component.html',
  styleUrls: ['./confirm-input-dialog.component.scss'],
  imports: [
    MatButtonModule,
    MatFormField,
    MatInput,
    FormsModule
  ],
  standalone: true
})
export class ConfirmInputDialogComponent {

  // Store Data
  inputTxt: string;

  // Inject
  private readonly dialogRef = inject(MatDialogRef<ConfirmInputDialogComponent>);
  protected readonly data = inject(MAT_DIALOG_DATA);
  protected readonly uiService = inject(UiService);


  onConfirm(): void {
    if (this.inputTxt === this.data?.info?.matchValue) {
      this.dialogRef.close(true);
    } else {
      this.uiService.message(this.data?.message, 'warn');
    }
  }

  onDismiss(): void {
    this.dialogRef.close(false);
  }


}
