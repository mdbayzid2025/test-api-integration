import {Component, Inject, Input, OnChanges, SimpleChanges} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-table-details-dialog',
  standalone: true,
  imports: [
    NgForOf
  ],
  templateUrl: './table-details-dialog.component.html',
  styleUrl: './table-details-dialog.component.scss'
})
export class TableDetailsDialogComponent {
  @Input() nestedFieldName: string | any = 'name';
  dataArray: { label: string; value: any }[] = [];

  constructor(
    public dialogRef: MatDialogRef<TableDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {

    this.nestedFieldName = data?.nestedFieldName || 'name';
    if (data?.data) {
      this.prepareData(data?.data);
    }

  }

  prepareData(data: any) {
    this.dataArray = [];

    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        let value = data[key];

        // Handle nested objects
        if (value && typeof value === 'object' && !Array.isArray(value)) {
          // Check for null and undefined values, then access the nested field name
          value = value[this.nestedFieldName] ?? JSON.stringify(value, null, 2);
        } else if (Array.isArray(value)) {
          value = value?.join(', '); // Join arrays as a string
        }

        // Push the processed key-value pair into the data array
        this.dataArray.push({ label: key, value: value });
      }
    }
  }



  closeDialog(): void {
    this.dialogRef.close();
  }
}
