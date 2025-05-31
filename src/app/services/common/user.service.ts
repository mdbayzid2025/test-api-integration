import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ResponsePayload } from '../../interfaces/core/response-payload.interface';
import { environment } from '../../../environments/environment';
import { FilterData } from '../../interfaces/gallery/filter-data';
import { User } from '../../interfaces/common/user.interface';

const API_URL = environment.apiBaseLink + '/api/user/';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private httpClient: HttpClient
  ) {
  }

  /**
   * userSignup()
   * getLoggedInUserData()
   * getAllUsers()
   * getUserById()
   * updateUserById()
   * updateMultipleUserById()
   * deleteUserById()
   * deleteMultipleUserById()
   * updateLoggedInUserInfo()
   * changeLoggedInUserPassword()
   */

  userSignup(data: User) {
    return this.httpClient.post<ResponsePayload>(API_URL + 'signup', data);
  }

  getLoggedInUserData(select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }

    return this.httpClient.get<{ data: User }>(API_URL + 'logged-in-user-data', { params });
  }

  getAllUser(filterData: FilterData, searchQuery?: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    return this.httpClient.post<{ data: User[], count: number, success: boolean }>(API_URL + 'get-all', filterData, { params });
  }

  getUserById(id: string, select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.get<{ data: User, message: string, success: boolean }>(API_URL + 'get-by/' + id, { params });
  }

  updateUserById(id: string, data: User) {
    return this.httpClient.put<{ message: string, success: boolean }>(API_URL + 'update-data/' + id, data);
  }

  updateMultipleUserById(ids: string[], data: User) {
    const mData = { ...{ ids: ids }, ...data }
    return this.httpClient.put<ResponsePayload>(API_URL + 'update-data' + ids, mData);
  }

  deleteUserById(id: string, checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.delete<ResponsePayload>(API_URL + 'delete-data/' + id, { params });
  }

  deleteMultipleUserById(ids: string[], checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.post<ResponsePayload>(API_URL + 'delete-multiple-data-by-id', { ids: ids }, { params });
  }


  updateLoggedInUserInfo(data: User) {
    return this.httpClient.put<ResponsePayload>(API_URL + 'update-logged-in-user', data);
  }

  changeLoggedInUserPassword(data: { password: string, oldPassword: string }) {
    return this.httpClient.put<ResponsePayload>(API_URL + 'change-logged-in-user-password', data);
  }



}
