import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {ResponsePayload} from '../../interfaces/core/response-payload.interface';
import {ThemeCategory} from '../../interfaces/common/theme-category.interface';
import {FilterData} from "../../interfaces/gallery/filter-data";

const API_CATEGORY = environment.apiBaseLink + '/api/theme-category/';


@Injectable({
  providedIn: 'root'
})
export class ThemeCategoryService {

  constructor(
    private httpClient: HttpClient
  ) {
  }

  /**
   * addThemeCategory
   * insertManyThemeCategory
   * getAllCategories
   * getThemeCategoryById
   * updateThemeCategoryById
   * updateMultipleThemeCategoryById
   * deleteThemeCategoryById
   * deleteMultipleThemeCategoryById
   */

  addThemeCategory(data: ThemeCategory) {
    return this.httpClient.post<ResponsePayload>
    (API_CATEGORY + 'add', data);
  }

  insertManyThemeCategory(data: ThemeCategory, option?: any) {
    const mData = {data, option}
    return this.httpClient.post<ResponsePayload>
    (API_CATEGORY + 'insert-many', mData);
  }

  getAllCategories(filterData: FilterData, searchQuery?: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    return this.httpClient.post<{ data: ThemeCategory[], count: number, success: boolean }>(API_CATEGORY + 'get-all', filterData, {params});
  }

  getThemeCategoryById(id: string, select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.get<{ data: ThemeCategory, message: string, success: boolean }>(API_CATEGORY + 'get-by/' + id, {params});
  }

  updateThemeCategoryById(id: string, data: ThemeCategory) {
    return this.httpClient.put<{ message: string, success: boolean }>(API_CATEGORY + 'update/' + id, data);
  }

  changeMultipleThemeCategoryStatus(ids: string[], data: ThemeCategory) {
    const mData = {...{ids: ids}, ...data}
    return this.httpClient.put<ResponsePayload>(API_CATEGORY + 'change-multiple-category-status', mData);
  }

  updateMultipleThemeCategoryById(ids: string[], data: ThemeCategory) {
    const mData = {...{ids: ids}, ...data}
    return this.httpClient.put<ResponsePayload>(API_CATEGORY + 'update-multiple', mData);
  }

  deleteThemeCategoryById(id: string, checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.delete<ResponsePayload>(API_CATEGORY + 'delete/' + id, {params});
  }

  deleteMultipleThemeCategoryById(ids: string[], checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.post<ResponsePayload>(API_CATEGORY + 'delete-multiple', {ids: ids}, {params});
  }


}
