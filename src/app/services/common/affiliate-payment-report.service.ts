import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ResponsePayload } from '../../interfaces/core/response-payload.interface';
import { FilterData } from "../../interfaces/gallery/filter-data";
import {AffiliatePaymentReport} from "../../interfaces/common/affiliate-payment-report.interface";

const API_BASE_URL = environment.apiBaseLink + '/api/affiliate-payment-report/';


@Injectable({
  providedIn: 'root'
})
export class AffiliatePaymentReportService {

  constructor(
    private httpClient: HttpClient
  ) {
  }

  /**
   * addAffiliatePaymentReport
   * insertManyAffiliatePaymentReport
   * getAllAffiliatePaymentReports
   * getAffiliatePaymentReportById
   * updateAffiliatePaymentReportById
   * updateMultipleAffiliatePaymentReportById
   * deleteAffiliatePaymentReportById
   * deleteMultipleAffiliatePaymentReportById
   */

  addAffiliatePaymentReport(data: AffiliatePaymentReport) {
    return this.httpClient.post<ResponsePayload>
    (API_BASE_URL + 'add-by-admin', data);
  }


  getAllAffiliatePaymentReports(filterData: FilterData, searchQuery?: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    return this.httpClient.post<{ data: AffiliatePaymentReport[], count: number, success: boolean }>(API_BASE_URL + 'get-all', filterData, {params});
  }

  getAffiliatePaymentReportById(id: string, select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.get<{ data: AffiliatePaymentReport, message: string, success: boolean }>(API_BASE_URL + 'get-by-id/' + id, {params});
  }

  updateAffiliatePaymentReportById(id: string, data: AffiliatePaymentReport) {
    return this.httpClient.put<{ message: string, success: boolean }>(API_BASE_URL + 'update/' + id, data);
  }

  updateMultipleAffiliatePaymentReportById(ids: string[], data: AffiliatePaymentReport) {
    const mData = {...{ids: ids}, ...data}
    return this.httpClient.put<ResponsePayload>(API_BASE_URL + 'update-multiple', mData);
  }

  deleteAffiliatePaymentReportById(id: string, checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.delete<ResponsePayload>(API_BASE_URL + 'delete/' + id, {params});
  }

  deleteMultipleAffiliatePaymentReportById(ids: string[], checkUsage?: boolean) {
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
