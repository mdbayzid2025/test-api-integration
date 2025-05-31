import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {ResponsePayload} from '../../interfaces/core/response-payload.interface';
import {FilterData} from '../../interfaces/gallery/filter-data';
import {Observable} from "rxjs";
import {Subscriptions} from "../../interfaces/common/subscription.interface";


const API_URL = environment.apiBaseLink + '/api/subscription/';


@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {

  constructor(
    private httpClient: HttpClient
  ) {
  }

  /**
   * addSubscription
   * insertManySubscription
   * getAllSubscriptions
   * getSubscriptionById
   * updateSubscriptionById
   * updateMultipleSubscriptionById
   * deleteSubscriptionById
   * deleteMultipleSubscriptionById
   */

  addSubscriptions(data: Subscriptions):Observable<ResponsePayload> {
    return this.httpClient.post<ResponsePayload>(API_URL + 'add', data);
  }

  getAllSubscription(filterData: FilterData, searchQuery?: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    return this.httpClient.post<{ data: Subscriptions[], count: number, success: boolean }>(API_URL + 'get-all', filterData, {params});
  }

  getAllSubscriptionReport(filterData: FilterData, searchQuery?: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    return this.httpClient.post<{ data: Subscriptions[], count: number, success: boolean }>(API_URL + 'get-all-report/', filterData, {params});
  }

  getSubscriptionById(id: string, select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.get<{ data: Subscriptions, message: string, success: boolean }>(API_URL + 'get-by/'+id, {params});
  }

  updateSubscriptionById(id: string, data: Subscriptions) {
    return this.httpClient.put<{ message: string, success: boolean }>(API_URL + 'update/' + id, data);
  }

  updateMultipleSubscriptionById(ids: string[], data: Subscriptions) {
    const mData = {...{ids: ids}, ...data}
    return this.httpClient.put<ResponsePayload>(API_URL + 'update-multiple', mData);
  }


  deleteSubscriptionById(id: string, checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.delete<ResponsePayload>(API_URL + 'delete/' + id, {params});
  }

  deleteMultipleSubscriptionById(ids: string[], checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.post<ResponsePayload>(API_URL + 'delete-multiple', {ids: ids}, {params});
  }

  deleteMultipleSubscriptionReportById(ids: string[], checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.post<ResponsePayload>(API_URL + 'delete-multiple-subscription-report', {ids: ids}, {params});
  }

}
