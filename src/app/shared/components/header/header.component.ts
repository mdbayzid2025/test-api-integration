import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {Admin} from '../../../interfaces/common/admin.interface';
import {AdminService} from '../../../services/common/admin.service';
import {Subscription} from 'rxjs';
import {MatToolbarModule} from '@angular/material/toolbar';
import {RouterLink} from '@angular/router';
import {MatMenuModule} from '@angular/material/menu';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MatToolbarModule,
    RouterLink,
    MatMenuModule,
    MatTooltipModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  // Store Data
  @Output() onMenuToggle = new EventEmitter();
  admin: Admin = null;
  isOpen = false;

  // Subscriptions
  private subDataOne: Subscription;


  constructor(
    private adminService: AdminService
  ) {
  }

  ngOnInit() {
    this.getLoggedInAdminData();

  }

  /**
   * HTTP Req Handle
   * getLoggedInAdminData()
   * adminLogOut()
   */
  private getLoggedInAdminData() {
    const select = 'username profileImg role name'
    this.subDataOne = this.adminService.getLoggedInAdminData(select)
      .subscribe({
        next: res => {
          this.admin = res.data;
        },
        error: err => {
          console.log(err)
        }
      })
  }

  adminLogOut() {
    this.adminService.adminLogOut();
  }

  /**
   * On Click
   * onToggle()
   */
  onClickMenu() {
    this.isOpen = !this.isOpen;
    this.onMenuToggle.emit(this.isOpen);
  }


  /**
   * ON DESTROY
   */

  ngOnDestroy() {
    if (this.subDataOne) {
      this.subDataOne.unsubscribe();
    }
  }


}
