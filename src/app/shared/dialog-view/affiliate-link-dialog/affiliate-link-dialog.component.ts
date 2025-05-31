import {Component, inject, Inject} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef, MatDialogTitle
} from "@angular/material/dialog";
import {MatButton} from "@angular/material/button";
import {MatFormField} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {UiService} from "../../../services/core/ui.service";
import {environment} from "../../../../environments/environment";
import {AdminService} from "../../../services/common/admin.service";

@Component({
  selector: 'app-affiliate-link-dialog',
  templateUrl: './affiliate-link-dialog.component.html',
  styleUrl: './affiliate-link-dialog.component.scss',
  standalone: true,
  imports: [
    MatButton,
    MatDialogContent,
    MatFormField,
    MatDialogActions,
    MatDialogClose,
    MatDialogTitle,
    MatInput
  ]
})
export class AffiliateLinkDialogComponent {

  baseUrl: string = "";

  private readonly uiService = inject(UiService);
  private readonly adminService = inject(AdminService);
  constructor(
    private dialogRef: MatDialogRef<AffiliateLinkDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  ngOnInit() {
    this.baseUrl = `${environment.affiliateLink}/registration?ownerId=${this.adminService?.getAdminId()}&ownerType=admin`;

  }
  cancel() {
    this.dialogRef.close();
  }
  copyLink(): void {
    const url = this.baseUrl;
    if (url) {
      navigator.clipboard.writeText(url).then(() => {
        this.uiService.message('Link copied to clipboard', 'success');
      });
    } else {
      this.uiService.message('URL not available', 'warn');
    }
  }

}
