import {Component, ElementRef, EventEmitter, HostListener, Output, ViewChild} from '@angular/core';
import {ChildrenOutletContexts} from '@angular/router';
import {slideInAnimation} from '../animations';
import {AdminService} from '../services/common/admin.service';
import {AdminRoles} from '../enum/admin-roles.enum';
import {EDITOR_MENU, SUPER_ADMIN_MENU} from '../core/db/menu-data';
import {AdminMenu} from '../interfaces/core/admin-menu.interface';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrl: './pages.component.scss',
  animations: [
    slideInAnimation
  ]
})
export class PagesComponent {


  // Store Data
  allMenus: AdminMenu[] = [];

  selectedValue: string;
  sideNav = true;
  sideRes = false;
  subId = 0;
  step = 0;
  windowWidth: any;
  USER_ROLE: any;

  @ViewChild('dashboard') dashboard: ElementRef;

  constructor(
    private contexts: ChildrenOutletContexts,
    private adminService: AdminService,
  ) {
  }

  ngOnInit(): void {
    this.windowWidth = window.innerWidth;
    this.subId = JSON.parse(sessionStorage.getItem('sub-id'));
    this.USER_ROLE = this.adminService.getAdminRole();

    // console.log('user_type', this.USER_ROLE);


    if (this.USER_ROLE === AdminRoles.SUPER_ADMIN) {
      this.allMenus = SUPER_ADMIN_MENU;
    }

    if (this.USER_ROLE === AdminRoles.ADMIN) {
      this.allMenus = SUPER_ADMIN_MENU;
    }

    if (this.USER_ROLE === AdminRoles.EDITOR) {
      this.allMenus = EDITOR_MENU;
    }

  }

  /**
   * ALL SIDE BAR CONTROLL METHOD
   * sideNavToggle()
   * sideMenuHide()
   */
  sideNavToggle() {
    this.sideNav = !this.sideNav;
    if (this.sideNav) {
      this.sideRes = false;
    } else {
      this.sideRes = true;
    }
  }

  subMenuToggle(num: any, subMenu?: boolean) {
    this.windowWidth = window.innerWidth;
    sessionStorage.setItem('sub-id', num);
    if (this.subId && this.subId === num) {
      this.subId = 0;
      this.dashboard.nativeElement.classList.add('link-active');
    } else {
      this.subId = JSON.parse(sessionStorage.getItem('sub-id'));
      this.dashboard.nativeElement.classList.remove('link-active');
    }
    if (num === 0) {
      this.dashboard.nativeElement.classList.add('link-active');
    }
  }

  @HostListener('window:resize')
  onInnerWidthChange() {
    this.windowWidth = window.innerWidth;
  }

  onLogout() {
    this.adminService.adminLogOut();
  }


  getRouteAnimationData() {
    return this.contexts.getContext('primary')?.route?.snapshot?.data?.['animation'];
  }

  onMenuToggle(event: boolean) {
    console.log('event',event)
    this.sideNav = event;
    this.sideNavToggle();
  }
}
