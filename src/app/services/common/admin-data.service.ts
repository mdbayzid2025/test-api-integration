import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {ResponsePayload} from '../../interfaces/core/response-payload.interface';
import {Admin} from '../../interfaces/common/admin.interface';
import {environment} from '../../../environments/environment';
import {FilterData} from '../../interfaces/gallery/filter-data';

const API_URL = environment.apiBaseLink + '/api/admin/';


@Injectable({
  providedIn: 'root'
})
export class AdminDataService {

  constructor(
    private httpClient: HttpClient
  ) {
  }

  /**
   * adminSignup()
   * getLoggedInAdminData()
   * getAllAdmins()
   * getAdminById()
   * updateAdminById()
   * updateMultipleAdminById()
   * deleteAdminById()
   * deleteMultipleAdminById()
   * updateLoggedInAdminInfo()
   * changeLoggedInAdminPassword()
   */

  adminSignup(data: Admin) {
    return this.httpClient.post<ResponsePayload>(API_URL + 'signup', data);
  }

  getLoggedInAdminData(select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }

    return this.httpClient.get<{ data: Admin }>(API_URL + 'logged-in-admin-data', {params});
  }

  getAllAdmins(filterData: FilterData, searchQuery?: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    return this.httpClient.post<{ data: Admin[], count: number, success: boolean }>(API_URL + 'all-admins', filterData, {params});
  }

  getAdminById(id: string, select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.get<{ data: Admin, message: string, success: boolean }>(API_URL + id, {params});
  }

  updateAdminById(id: string, data: Admin) {
    return this.httpClient.put<{ message: string, success: boolean }>(API_URL + 'update-admin/' + id, data);
  }

  updateMultipleAdminById(ids: string[], data: Admin) {
    const mData = {...{ids: ids}, ...data}
    return this.httpClient.put<ResponsePayload>(API_URL + 'update-multiple-data-by-id', mData);
  }

  deleteAdminById(id: string, checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.delete<ResponsePayload>(API_URL + 'delete-admin/' + id, {params});
  }

  deleteMultipleAdminById(ids: string[], checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.post<ResponsePayload>(API_URL + 'delete-multiple-admin-by-id', {ids: ids}, {params});
  }


  updateLoggedInAdminInfo(data: Admin) {
    return this.httpClient.put<ResponsePayload>(API_URL + 'update-logged-in-admin', data);
  }

  changeLoggedInAdminPassword(data: { password: string, oldPassword: string }) {
    return this.httpClient.put<ResponsePayload>(API_URL + 'change-logged-in-admin-password', data);
  }



}
