import {Injectable} from '@angular/core';
import {NavBreadcrumb} from '../../interfaces/core/nav-breadcrumb.interface';

@Injectable({
  providedIn: 'root'
})
export class PageDataService {
  private title: string;
  private navArray: NavBreadcrumb[] = [];

  setPageData(data: {title: string, navArray?: NavBreadcrumb[]}): void {
    this.title = data?.title;
    this.navArray = data.navArray;
  }

  get pageData(): { title: string, navArray?: NavBreadcrumb[] } {
    return {
      title: this.title,
      navArray: this.navArray
    }
  }
}
