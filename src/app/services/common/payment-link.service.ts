import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ResponsePayload } from '../../interfaces/core/response-payload.interface';
import { PaymentLink } from '../../interfaces/common/payment-link.interface';
import { FilterData } from "../../interfaces/gallery/filter-data";

const API_BASE_URL = environment.apiBaseLink + '/api/payment-link/';


@Injectable({
  providedIn: 'root'
})
export class PaymentLinkService {

  constructor(
    private httpClient: HttpClient
  ) {
  }

  /**
   * addPaymentLink
   * insertManyPaymentLink
   * getAllPaymentLinks
   * getPaymentLinkById
   * updatePaymentLinkById
   * updateMultiplePaymentLinkById
   * deletePaymentLinkById
   * deleteMultiplePaymentLinkById
   */

  addPaymentLink(data: PaymentLink) {
    return this.httpClient.post<ResponsePayload>
    (API_BASE_URL + 'add-by-admin', data);
  }


  getAllPaymentLinks(filterData: FilterData, searchQuery?: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    return this.httpClient.post<{ data: PaymentLink[], count: number, success: boolean }>(API_BASE_URL + 'get-all', filterData, {params});
  }

  getPaymentLinkById(id: string, select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.get<{ data: PaymentLink, message: string, success: boolean }>(API_BASE_URL + 'get-by-id/' + id, {params});
  }

  getAllPaymentLinksSaleReport(id: string, select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.get<{ data: any, message: string, success: boolean }>(API_BASE_URL + 'get-all-sale-report-by-affiliate/' + id, {params});
  }



  updatePaymentLinkById(id: string, data: PaymentLink) {
    return this.httpClient.put<{ message: string, success: boolean }>(API_BASE_URL + 'update/' + id, data);
  }

  updateMultiplePaymentLinkById(ids: string[], data: PaymentLink) {
    const mData = {...{ids: ids}, ...data}
    return this.httpClient.put<ResponsePayload>(API_BASE_URL + 'update-multiple', mData);
  }

  deletePaymentLinkById(id: string, checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.delete<ResponsePayload>(API_BASE_URL + 'delete/' + id, {params});
  }

  deleteMultiplePaymentLinkById(ids: string[], checkUsage?: boolean) {
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
