import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {ResponsePayload} from '../../interfaces/core/response-payload.interface';
import {environment} from '../../../environments/environment';
import {FilterData} from '../../interfaces/gallery/filter-data';
import { Vendor } from '../../interfaces/common/vendor.interface';

const API_URL = environment.apiBaseLink + '/api/vendor/';


@Injectable({
  providedIn: 'root'
})
export class VendorService {

  constructor(
    private httpClient: HttpClient
  ) {
  }

  /**
   * vendorSignup()
   * getLoggedInVendorData()
   * getAllVendor()
   * getVendorById()
   * updateVendorById()
   * updateMultipleVendorById()
   * deleteVendorById()
   * deleteMultipleVendorById()
   * updateLoggedInVendorInfo()
   * changeLoggedInVendorPassword()
   */

  vendorSignup(data: Vendor) {
    return this.httpClient.post<ResponsePayload>(API_URL + 'signup', data);
  }

  adminLoginAsVendor(data: any) {
    return this.httpClient.post<ResponsePayload>(API_URL + 'admin-login', data);
  }

  getLoggedInVendorData(select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }

    return this.httpClient.get<{ data: Vendor }>(API_URL + 'logged-in-admin-data', {params});
  }

  getAllVendor(filterData: FilterData, searchQuery?: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    return this.httpClient.post<{ data: Vendor[], count: number, success: boolean }>(API_URL + 'all-vendors', filterData, {params});
  }

  getVendorById(id: string, select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.get<{ data: Vendor, message: string, success: boolean }>(API_URL + 'get-by/' + id, {params});
  }

  updateVendorById(id: string, data: Vendor) {
    return this.httpClient.put<{ message: string, success: boolean }>(API_URL + 'update-vendor/' + id, data);
  }

  updateMultipleVendorById(ids: string[], data: Vendor) {
    const mData = {...{ids: ids}, ...data}
    return this.httpClient.put<ResponsePayload>(API_URL + 'update-data' + ids, mData);
  }

  deleteVendorById(id: string, checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.delete<ResponsePayload>(API_URL + 'delete-data/' + id, {params});
  }

  deleteMultipleVendorById(ids: string[], checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.post<ResponsePayload>(API_URL + 'delete-data', {ids: ids}, {params});
  }


  updateLoggedInVendorInfo(data: Vendor) {
    return this.httpClient.put<ResponsePayload>(API_URL + 'update-logged-in-admin', data);
  }

  changeLoggedInVendorPassword(data: { password: string, oldPassword: string }) {
    return this.httpClient.put<ResponsePayload>(API_URL + 'change-logged-in-admin-password', data);
  }



}
