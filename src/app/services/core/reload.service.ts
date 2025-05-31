import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReloadService {
  private refreshUser = new Subject<void>();
  private refreshData = new Subject<void>();

  /**
   * REFRESH GLOBAL DATA
   */
  get refreshData$() {
    return this.refreshData;
  }
  needRefreshData$() {
    this.refreshData.next();
  }




  /**
   * REFRESH USEr DATA
   */

  get refreshUser$() {
    return this.refreshUser;
  }
  needRefreshUser$() {
    this.refreshUser.next();
  }

}
