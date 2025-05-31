import { Component } from '@angular/core';
import {ADMIN_MENU_DB} from '../../core/db/admin-menu.db';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  // Static Data
  readonly adminMenu = ADMIN_MENU_DB;

}
