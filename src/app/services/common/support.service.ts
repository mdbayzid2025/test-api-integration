import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Support} from '../../interfaces/common/support.interface';
import {ResponsePayload} from "../../interfaces/core/response-payload.interface";
import {FilterData} from '../../interfaces/gallery/filter-data';

const API_URL = environment.apiBaseLink + '/api/support/';


@Injectable({
  providedIn: 'root'
})
export class SupportService {

  constructor(
    private httpClient: HttpClient
  ) {
  }

  /**
   * Support Control
   */

  addSupport(data: Support) {
    return this.httpClient.post<{ message: string, success: boolean }>(API_URL + 'add-by-vendor', data);
  }


  getAllSupports(filterData: FilterData, searchQuery?: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    return this.httpClient.post<{
      data: Support[],
      count: number,
      success: boolean,
      maxLimit: any
    }>(API_URL + 'get-all', filterData, {params});
  }


  getSupportById(id: string, select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.get<{
      data: Support,
      message: string,
      success: boolean
    }>(API_URL + 'get-by-id/' + id, {params});
  }

  updateSupport(id: string, data: any) {
    return this.httpClient.put<ResponsePayload>(API_URL + 'update/' + id, data);
  }


  deleteMultipleSupportById(ids: string[]) {
    let params = new HttpParams();
    return this.httpClient.post<ResponsePayload>(API_URL + 'delete-multiple', {ids: ids}, {params});
  }
}
