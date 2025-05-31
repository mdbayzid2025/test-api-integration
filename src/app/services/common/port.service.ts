import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {ResponsePayload} from '../../interfaces/core/response-payload.interface';
import {FilterData} from '../../interfaces/gallery/filter-data';
import {Observable} from "rxjs";
import {Port} from "../../interfaces/common/port.interface";


const API_URL = environment.apiBaseLink + '/api/port/';


@Injectable({
  providedIn: 'root'
})
export class PortService {

  constructor(
    private httpClient: HttpClient
  ) {
  }

  /**
   * addPort
   * insertManyPort
   * getAllPorts
   * getPortById
   * updatePortById
   * updateMultiplePortById
   * deletePortById
   * deleteMultiplePortById
   */

  addPort(data: Port):Observable<ResponsePayload> {
    return this.httpClient.post<ResponsePayload>(API_URL + 'add', data);
  }

  addManyPort(data: Port[]):Observable<ResponsePayload> {
    return this.httpClient.post<ResponsePayload>(API_URL + 'insert-many', {data});
  }

  getAllPort(filterData: FilterData, searchQuery?: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    return this.httpClient.post<{ data: Port[], count: number, success: boolean }>(API_URL + 'get-all/', filterData, {params});
  }

  getPortById(id: string, select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.get<{ data: Port, message: string, success: boolean }>(API_URL + 'get-by/'+id, {params});
  }

  updatePortById(id: string, data: Port) {
    return this.httpClient.put<{ message: string, success: boolean }>(API_URL + 'update/' + id, data);
  }

  updateMultiplePortById(ids: string[], data: Port) {
    const mData = {...{ids: ids}, ...data}
    return this.httpClient.put<ResponsePayload>(API_URL + 'update-multiple', mData);
  }


  deletePortById(id: string, checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.delete<ResponsePayload>(API_URL + 'delete/' + id, {params});
  }

  deleteMultiplePortById(ids: string[], checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.post<ResponsePayload>(API_URL + 'delete-multiple', {ids: ids}, {params});
  }

}
