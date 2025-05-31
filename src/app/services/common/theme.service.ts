import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {ResponsePayload} from '../../interfaces/core/response-payload.interface';
import {FilterData} from '../../interfaces/gallery/filter-data';
import {Observable} from "rxjs";
import {Theme} from "../../interfaces/common/theme.interface";


const API_URL = environment.apiBaseLink + '/api/theme/';


@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  constructor(
    private httpClient: HttpClient
  ) {
  }

  /**
   * addTheme
   * insertManyTheme
   * getAllThemes
   * getThemeById
   * updateThemeById
   * updateMultipleThemeById
   * deleteThemeById
   * deleteMultipleThemeById
   */

  addTheme(data: Theme):Observable<ResponsePayload> {
    return this.httpClient.post<ResponsePayload>(API_URL + 'add', data);
  }

  getAllTheme(filterData: FilterData, searchQuery?: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    return this.httpClient.post<{ data: Theme[], count: number, success: boolean }>(API_URL + 'get-all/', filterData, {params});
  }

  getThemeById(id: string, select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.get<{ data: Theme, message: string, success: boolean }>(API_URL + 'get-by/'+id, {params});
  }

  updateThemeById(id: string, data: Theme) {
    return this.httpClient.put<{ message: string, success: boolean }>(API_URL + 'update/' + id, data);
  }

  updateMultipleThemeById(ids: string[], data: Theme) {
    const mData = {...{ids: ids}, ...data}
    return this.httpClient.put<ResponsePayload>(API_URL + 'update-multiple', mData);
  }


  deleteThemeById(id: string, checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.delete<ResponsePayload>(API_URL + 'delete/' + id, {params});
  }

  deleteMultipleThemeById(ids: string[], checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.post<ResponsePayload>(API_URL + 'delete-multiple-by-admin',  {ids: ids}, {params});
  }

}
