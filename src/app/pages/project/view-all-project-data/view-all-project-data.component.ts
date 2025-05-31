import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-view-all-project-data',
  templateUrl: './view-all-project-data.component.html',
  styleUrl: './view-all-project-data.component.scss',
  providers: [DatePipe]
})
export class ViewAllProjectDataComponent {
  constructor(public dialogRef: MatDialogRef<ViewAllProjectDataComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit(): void {

  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onDismiss(): void {
    this.dialogRef.close(false);
  }


}
