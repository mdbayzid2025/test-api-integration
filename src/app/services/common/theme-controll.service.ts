import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeControllService {

  //STORE SUBJECT
  colorRefresh = new Subject();
  sideBarColorRefresh = new Subject();
  inputStyleRefresh = new Subject();
  menuTypeRefresh = new Subject();

  constructor() { }

  /**
   * COLOR REFRESH FUNCTIONALITY
   */

  get refreshColor$() {
    return this.colorRefresh;
  }


  needRefreshColor$(data: any) {
    this.colorRefresh.next(data);
  }



  /**
   * SIDEBAR COLOR REFRESH FUNCTIONALITY
   */

  get refreshSideBarColor$() {
    return this.sideBarColorRefresh;
  }


  needRefreshSideBarColor$(data: any) {
    this.sideBarColorRefresh.next(data);
  }


  /**
 * INPUT STYLE REFRESH FUNCTIONALITY
 */

  get refreshInputStyle$() {
    return this.inputStyleRefresh;
  }


  needRefreshInputStyle$(data: any) {
    this.inputStyleRefresh.next(data);
  }

    /**
   * MENU TYPE REFRESH FUNCTIONALITY
   */

    get refreshMenuType$() {
      return this.menuTypeRefresh;
    }
  
  
    needRefreshMenuType$(data: any) {
      this.menuTypeRefresh.next(data);
    }
  
  

}
