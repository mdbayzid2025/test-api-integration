import {Component, inject, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {NgClass, NgForOf, TitleCasePipe} from '@angular/common';
import {MatProgressBar} from '@angular/material/progress-bar';
import {MatButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {Clipboard} from '@angular/cdk/clipboard';
import {ShopService} from '../../../services/common/shop.service';

@Component({
  selector: 'app-website-build-dialog',
  standalone: true,
  imports: [
    NgForOf,
    MatProgressBar,
    MatButton,
    MatIcon,
    NgClass,
    TitleCasePipe
  ],
  templateUrl: './website-build-dialog.component.html',
  styleUrl: './website-build-dialog.component.scss'
})
export class WebsiteBuildDialogComponent implements OnInit {
  buildStatus: string = 'pending'
  elapsedTime: number = 0;
  totalTime: number = 10; // Total time in seconds (e.g., 5 minutes)

  // Inject
  private readonly shopService = inject(ShopService);
  private readonly clipboard = inject(Clipboard);

  constructor(
    public dialogRef: MatDialogRef<WebsiteBuildDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.startProgress();
  }

  ngOnInit() {
    if (this.data) {
      console.log('this.data', this.data)
      this.checkShopBuildStatusById(this.data.shop);
    }
  }

  startProgress() {
    const interval = setInterval(() => {
      if (this.elapsedTime < this.totalTime) {
        this.elapsedTime++;
      } else {
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


  closeDialog() {
    this.dialogRef.close();
  }


  private checkShopBuildStatusById(shopId: string) {
    this.shopService.checkShopBuildStatusByInterval(shopId, 1200)
      .subscribe({
        next: res => {
          if (res.data) {
            if (res.data.buildStatus === 'complete') {
              setTimeout(() => {
                this.buildStatus = res.data.buildStatus;
              }, 5000)
            } else {
              this.buildStatus = res.data.buildStatus;
            }
            if (this.buildStatus === 'secure') {
              this.elapsedTime = this.totalTime;
            }
          }
        },
        error: err => {
          console.log(err)
        }
      })
  }

  public copyWebsiteInfo() {
    const txt = `
    ** Website Information **
    Website Url : https://${this.data?.domain ?? this.data?.subDomain}
    Admin Url: https://admin.saleecom.com
    username: ${this.data?.username}
    password: ${this.data?.password}
    `
    this.clipboard.copy(txt);
  }
}
