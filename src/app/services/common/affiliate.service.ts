import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {ResponsePayload} from '../../interfaces/core/response-payload.interface';
import {environment} from '../../../environments/environment';
import {FilterData} from '../../interfaces/gallery/filter-data';
import {Affiliate} from '../../interfaces/common/affiliate.interface';

const API_URL = environment.apiBaseLink + '/api/affiliate/';


@Injectable({
  providedIn: 'root'
})
export class AffiliateService {

  constructor(
    private httpClient: HttpClient
  ) {
  }

  /**
   * affiliateSignup()
   * getLoggedInAffiliateData()
   * getAllAffiliate()
   * getAffiliateById()
   * updateAffiliateById()
   * updateMultipleAffiliateById()
   * deleteAffiliateById()
   * deleteMultipleAffiliateById()
   * updateLoggedInAffiliateInfo()
   * changeLoggedInAffiliatePassword()
   */

  affiliateSignup(data: Affiliate) {
    return this.httpClient.post<ResponsePayload>(API_URL + 'signup', data);
  }

  getLoggedInAffiliateData(select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }

    return this.httpClient.get<{ data: Affiliate }>(API_URL + 'logged-in-admin-data', {params});
  }

  getAllAffiliate(filterData: FilterData, searchQuery?: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    return this.httpClient.post<{
      data: Affiliate[],
      count: number,
      success: boolean
    }>(API_URL + 'all-affiliates', filterData, {params});
  }

  getAffiliateById(id: string, select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.get<{
      data: Affiliate,
      message: string,
      success: boolean
    }>(API_URL + 'get-by/' + id, {params});
  }

  getPendingAffiliates(ownerType: 'shop' | 'admin', ownerId: string, search = '') {
    return this.httpClient.get<{ total: number, data: any[] }>(
      `${API_URL}get-all-pending-affiliates/${ownerType}/${ownerId}?search=${encodeURIComponent(search)}`
    );
  }
  getAllApprovedAffiliates(ownerType: 'shop' | 'admin', ownerId: string, search = '') {
    return this.httpClient.get<{ total: number, data: any[] }>(
      `${API_URL}get-all-approved-affiliates/${ownerType}/${ownerId}?search=${encodeURIComponent(search)}`
    );
  }

  getSingleAffiliatePaymentInfo(ownerType: 'shop' | 'admin', ownerId: string, affiliateId : string) {
    return this.httpClient.get<{ data: any }>(
      `${API_URL}get-payment-info-by-owner-by-affiliateId/${ownerType}/${ownerId}/${affiliateId}`
    );
  }


  updateAffiliateById(id: string, data: Affiliate) {
    return this.httpClient.put<{ message: string, success: boolean }>(API_URL + 'update-affiliate/' + id, data);
  }

  updatePaymentClearByOwner(id: string, data: any) {
    return this.httpClient.put<{ message: string, success: boolean }>(
      API_URL + 'update-and-payment-clear-from-owner/' + id,
      data
    );
  }


  updateAffiliateStatus(
    ownerType: 'shop' | 'admin',
    ownerId: string,
    affiliateId: string,
    status: 'approved' | 'blocked' | 'pending'
  ) {
    return this.httpClient.put<{ success: boolean; message: string }>(
      `${API_URL}approved-affiliate-and-change-status/${ownerType}/${ownerId}/${affiliateId}`,
      {status}
    );
  }


  updateMultipleAffiliateById(ids: string[], data: Affiliate) {
    const mData = {...{ids: ids}, ...data}
    return this.httpClient.put<ResponsePayload>(API_URL + 'update-data' + ids, mData);
  }

  deleteAffiliateById(id: string, checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.delete<ResponsePayload>(API_URL + 'delete-data/' + id, {params});
  }

  deleteMultipleAffiliateById(ids: string[], checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.post<ResponsePayload>(API_URL + 'delete-multiple-affiliate-by-id', {ids: ids}, {params});
  }


  updateLoggedInAffiliateInfo(data: Affiliate) {
    return this.httpClient.put<ResponsePayload>(API_URL + 'update-logged-in-admin', data);
  }

  changeLoggedInAffiliatePassword(data: { password: string, oldPassword: string }) {
    return this.httpClient.put<ResponsePayload>(API_URL + 'change-logged-in-admin-password', data);
  }


}
