import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';

import {Observable} from "rxjs";
import {FilterData} from "../../interfaces/gallery/filter-data";



const API_DASHBOARD = environment.apiBaseLink + '/api/dashboard/';


@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(
    private httpClient: HttpClient
  ) {
  }


  getAllDashboardOrders(filterData: FilterData, searchQuery?: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    return this.httpClient.post<{
      data: any[],
      count: number,
      totalProfit: number,
      success: boolean
    }>(API_DASHBOARD + 'get-all-affiliate-info-for-owner', filterData, {params});
  }

  getDashboardCategoryByProduct() {
    return this.httpClient.get<any>(API_DASHBOARD + 'dashboard-category-by-product');
  }

  getSalesData(period: string): Observable<any> {
    let params = new HttpParams();
    // if (searchQuery) {
    //   params = params.append('q', searchQuery);
    // }
    return this.httpClient.get(API_DASHBOARD + `dashboard-graph-by-shop?period=${period}`);
  }
}
