import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {UiService} from "../../../services/core/ui.service";
import {MatDialog} from "@angular/material/dialog";
import {ConfirmDialogComponent} from "../../../shared/components/ui/confirm-dialog/confirm-dialog.component";
import {WebsiteBuildService} from '../../../services/common/website-build.service';
import {Subscription} from 'rxjs';
import {ThemeService} from '../../../services/common/theme.service';
import {Pagination} from '../../../interfaces/core/pagination';
import {FilterData} from '../../../interfaces/gallery/filter-data';
import {Theme} from '../../../interfaces/common/theme.interface';
import {ShopService} from '../../../services/common/shop.service';
import {
  WebsiteUpdateDialogComponent
} from '../../../shared/dialog-view/website-update-dialog/website-update-dialog.component';
import {
  WebsiteProgressDialogComponent
} from '../../../shared/dialog-view/website-progress-dialog/website-progress-dialog.component';

@Component({
  selector: 'app-update-website',
  templateUrl: './update-website.component.html',
  styleUrl: './update-website.component.scss'
})
export class UpdateWebsiteComponent implements OnInit, OnDestroy {

  // Loading Control
  actionType: string;
  isLoading: boolean = false;

  // Store Data
  themes: Theme[] = []


  // Inject
  private readonly uiService = inject(UiService);
  private readonly dialog = inject(MatDialog);
  private readonly websiteBuildService = inject(WebsiteBuildService);
  private readonly themeDataService = inject(ThemeService);
  private readonly shopService = inject(ShopService);

  // Subscriptions
  private subscriptions: Subscription[] = [];

  ngOnInit(): void {
    this.getAllTheme();
  }

  /**
   * COMPONENT DIALOG VIEW
   * openConfirmDialog()
   */
  public openConfirmDialog(type: string, data?: any): void {
    this.actionType = type;

    const getMessage = () => {
      if (type === 'theme') {
        return 'Are you sure you to update the theme';
      } else if (type === 'vendor') {
        return 'Are you sure you to update and build the vendor panel';
      } else if (type === 'admin') {
        return 'Are you sure you to update and build the admin panel';
      }  else if (type === 'shop') {
        return 'Are you sure you to update all shop based on this theme';
      }
      else {
        return '';
      }
    }

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '400px',
      data: {
        title: 'Confirm Update',
        message: getMessage()
      }
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        if (type === 'theme') {
          this.themeGitUpdate();
        } else if (type === 'vendor') {
          this.vendorPanelUpdateAndBuild();
        } else if (type === 'admin') {
          this.adminPanelUpdateAndBuild();
        } else if (type === 'shop') {
          this.shopsVersionUpdateByTheme(data);
        } else {
          this.uiService.message('Nothing!', 'warn');
        }
      }
    });

  }

  /**
   * HTTP Req Handle
   * themeGitUpdate()
   * vendorPanelUpdateAndBuild()
   * adminPanelUpdateAndBuild()
   */


  private themeGitUpdate() {
    this.isLoading = true;
    const subscribe = this.websiteBuildService.themeGitUpdate()
      .subscribe({
        next: res => {
          this.isLoading = false;
          this.actionType = null;
          if (res.success) {
            this.uiService.message(res.message, 'success');
          } else {
            this.uiService.message(res.message, 'warn');
          }
        },
        error: err => {
          this.isLoading = false;
          console.log(err)
        }
      });
    this.subscriptions.push(subscribe);
  }

  private vendorPanelUpdateAndBuild() {
    this.isLoading = true;
    const subscribe = this.websiteBuildService.vendorPanelUpdateAndBuild()
      .subscribe({
        next: res => {
          this.isLoading = false;
          this.actionType = null;
          if (res.success) {
            this.uiService.message(res.message, 'success');
          } else {
            this.uiService.message(res.message, 'warn');
          }
        },
        error: err => {
          this.isLoading = false;
          console.log(err)
        }
      });
    this.subscriptions.push(subscribe);
  }

  private shopsVersionUpdateByTheme(themeId: string) {
    this.isLoading = true;
    const subscribe = this.shopService.shopsVersionUpdateByTheme(themeId)
      .subscribe({
        next: res => {
          this.isLoading = false;
          this.actionType = null;
          if (res.success) {
            this.uiService.message(res.message, 'success');
            if(res.data) {
              this.openWebsiteUpdateDialog(res.data);
            }
          } else {
            this.uiService.message(res.message, 'warn');
          }
        },
        error: err => {
          this.isLoading = false;
          console.log(err)
        }
      });
    this.subscriptions.push(subscribe);
  }

  private adminPanelUpdateAndBuild() {
    this.isLoading = true;
    const subscribe = this.websiteBuildService.adminPanelUpdateAndBuild()
      .subscribe({
        next: res => {
          this.isLoading = false;
          this.actionType = null;
          if (res.success) {
            this.uiService.message(res.message, 'success');
          } else {
            this.uiService.message(res.message, 'warn');
          }
        },
        error: err => {
          this.isLoading = false;
          console.log(err)
        }
      });
    this.subscriptions.push(subscribe);
  }

  private getAllTheme() {

    const filterData: FilterData = {
      pagination: null,
      filter: {status: 'publish'},
      select: {name: 1, version: 1},
      sort: {name: 1}
    }

     this.themeDataService.getAllTheme(filterData, null)
      .subscribe({
        next: res => {
          this.themes = res.data;

          console.log('this.themes', this.themes)
        },
        error: err => {
          console.log(err)
        }
      })
  }


  openWebsiteUpdateDialog(data?: any): void {
    const dialogRef = this.dialog.open(WebsiteProgressDialogComponent, {
      maxWidth: '600px',
      width: '95%',
      data: data,
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      // this.reloadService.needRefreshData$();
    });
  }

  /**
   * ON Destroy
   */
  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub?.unsubscribe());
  }

}
