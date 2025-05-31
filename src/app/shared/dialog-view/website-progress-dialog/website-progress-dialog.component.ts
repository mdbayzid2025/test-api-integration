import {Component, inject, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogClose, MatDialogRef} from '@angular/material/dialog';
import {NgClass, TitleCasePipe} from '@angular/common';
import {MatProgressBar} from '@angular/material/progress-bar';
import {MatButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {Clipboard} from '@angular/cdk/clipboard';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-website-progress-dialog',
  standalone: true,
  imports: [
    MatProgressBar,
    MatButton,
    MatIcon,
    NgClass,
    TitleCasePipe,
    RouterLink,
    MatDialogClose
  ],
  templateUrl: './website-progress-dialog.component.html',
  styleUrl: './website-progress-dialog.component.scss'
})
export class WebsiteProgressDialogComponent implements OnInit {
  buildStatus: string = 'pending'
  elapsedTime: number = 0;
  totalTime: number = 10; // Total time in seconds (e.g., 5 minutes)

  // Shop count:
  timeInSec: number = 30;
  totalShop: number = 10;

  currentShop: number = 0;
  intervalMs!: number;


  // Inject
  private readonly clipboard = inject(Clipboard);

  constructor(
    public dialogRef: MatDialogRef<WebsiteProgressDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.startProgress();
  }

  ngOnInit() {
    if (this.data) {
      this.totalTime = this.data.timeInSec ?? 30;
      this.timeInSec = this.totalTime;
      this.totalShop = this.data.totalShop;
      console.log('this.timeInSec', this.timeInSec);
      console.log('this.totalShop', this.totalShop);
      // Calculate how many seconds to wait per shop
      this.intervalMs = (this.timeInSec * 1000) / this.totalShop;

      this.startCounter();
    }
  }

  startProgress() {
    const interval = setInterval(() => {
      if (this.elapsedTime < this.totalTime) {
        this.elapsedTime++;
      } else {
        this.buildStatus = 'updated';
        clearInterval(interval);
      }
    }, 1000); // Update every second
  }

  get progressValue(): number {
    return (this.elapsedTime / this.totalTime) * 100;
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  }

  startCounter() {
    let count = 1;
    const interval = setInterval(() => {
      this.currentShop = count;

      if (count >= this.totalShop) {
        clearInterval(interval);
      } else {
        count++;
      }
    }, this.intervalMs);
  }


  closeDialog() {
    this.dialogRef.close();
  }

}
