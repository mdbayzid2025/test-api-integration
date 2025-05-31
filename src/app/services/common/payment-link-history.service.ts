import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ResponsePayload } from '../../interfaces/core/response-payload.interface';
import { PaymentLinkHistory } from '../../interfaces/common/payment-link-history.interface';
import { FilterData } from "../../interfaces/gallery/filter-data";

const API_BASE_URL = environment.apiBaseLink + '/api/payment-link-history/';


@Injectable({
  providedIn: 'root'
})
export class PaymentLinkHistoryService {

  constructor(
    private httpClient: HttpClient
  ) {
  }

  /**
   * addPaymentLinkHistory
   * insertManyPaymentLinkHistory
   * getAllPaymentLinkHistorys
   * getPaymentLinkHistoryById
   * updatePaymentLinkHistoryById
   * updateMultiplePaymentLinkHistoryById
   * deletePaymentLinkHistoryById
   * deleteMultiplePaymentLinkHistoryById
   */

  addPaymentLinkHistory(data: PaymentLinkHistory) {
    return this.httpClient.post<ResponsePayload>
    (API_BASE_URL + 'add-by-admin', data);
  }


  createPaymentLinkHistory(data: PaymentLinkHistory) {
    return this.httpClient.post<ResponsePayload>
    (API_BASE_URL + 'create-payment-link-history', data);
  }


  getAllPaymentLinkHistorys(filterData: FilterData, searchQuery?: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    return this.httpClient.post<{ data: PaymentLinkHistory[], count: number, success: boolean }>(API_BASE_URL + 'get-all', filterData, {params});
  }

  getPaymentLinkHistoryById(id: string, select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.get<{ data: PaymentLinkHistory, message: string, success: boolean }>(API_BASE_URL + 'get-by-id/' + id, {params});
  }

  getAllPaymentLinkHistorysSaleReport(id: string, select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.get<{ data: any, message: string, success: boolean }>(API_BASE_URL + 'get-all-sale-report-by-affiliate/' + id, {params});
  }



  updatePaymentLinkHistoryById(id: string, data: PaymentLinkHistory) {
    return this.httpClient.put<{ message: string, success: boolean }>(API_BASE_URL + 'update/' + id, data);
  }

  updateMultiplePaymentLinkHistoryById(ids: string[], data: PaymentLinkHistory) {
    const mData = {...{ids: ids}, ...data}
    return this.httpClient.put<ResponsePayload>(API_BASE_URL + 'update-multiple', mData);
  }

  deletePaymentLinkHistoryById(id: string, checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.delete<ResponsePayload>(API_BASE_URL + 'delete/' + id, {params});
  }

  deleteMultiplePaymentLinkHistoryById(ids: string[], checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.post<ResponsePayload>(API_BASE_URL + 'delete-multiple-by-admin', {ids: ids}, {params});
  }

  deleteAllTrashByShop( checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.post<ResponsePayload>(API_BASE_URL + 'delete-all-trash-by-shop', {params});
  }
}
