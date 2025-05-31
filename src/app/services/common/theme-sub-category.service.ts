import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {ResponsePayload} from '../../interfaces/core/response-payload.interface';
import {ThemeSubCategory} from '../../interfaces/common/theme-sub-category.interface';
import {FilterData} from "../../interfaces/gallery/filter-data";
import {ThemeCategory} from "../../interfaces/common/theme-category.interface";

const API_SUB_CATEGORY = environment.apiBaseLink + '/api/theme-sub-category/';


@Injectable({
  providedIn: 'root'
})
export class ThemeSubCategoryService {

  constructor(
    private httpClient: HttpClient
  ) {
  }

  /**
   * addThemeSubCategory
   * insertManyThemeSubCategory
   * getAllCategories
   * getThemeSubCategoryById
   * updateThemeSubCategoryById
   * updateMultipleThemeSubCategoryById
   * deleteThemeSubCategoryById
   * deleteMultipleThemeSubCategoryById
   */

  addThemeSubCategory(data: ThemeSubCategory) {
    return this.httpClient.post<ResponsePayload>
    (API_SUB_CATEGORY + 'add', data);
  }

  insertManyThemeSubCategory(data: ThemeSubCategory, option?: any) {
    const mData = {data, option}
    return this.httpClient.post<ResponsePayload>
    (API_SUB_CATEGORY + 'insert-many', mData);
  }

  getAllThemeSubCategories(filterData: FilterData, searchQuery?: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    return this.httpClient.post<{ data: ThemeSubCategory[], count: number, success: boolean }>(API_SUB_CATEGORY + 'get-all', filterData, {params});
  }

  getThemeSubCategoryById(id: string, select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.get<{ data: ThemeSubCategory, message: string, success: boolean }>(API_SUB_CATEGORY + 'get-by/' + id, {params});
  }

  getSubCategoriesByCategoryId(categoryId: string, select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.get<{ data: ThemeSubCategory[], message: string, success: boolean }>(API_SUB_CATEGORY + 'get-all-by-parent/' + categoryId, {params});
  }

  updateThemeSubCategoryById(id: string, data: ThemeSubCategory) {
    return this.httpClient.put<{ message: string, success: boolean }>(API_SUB_CATEGORY + 'update/' + id, data);
  }

  updateMultipleThemeSubCategoryById(ids: string[], data: ThemeSubCategory) {
    const mData = {...{ids: ids}, ...data}
    return this.httpClient.put<ResponsePayload>(API_SUB_CATEGORY + 'update-multiple', mData);
  }

  changeMultipleThemeSubCategoryStatus(ids: string[], data: ThemeCategory) {
    const mData = {...{ids: ids}, ...data}
    return this.httpClient.put<ResponsePayload>(API_SUB_CATEGORY + 'change-multiple-sub-category-status', mData);
  }

  deleteThemeSubCategoryById(id: string, checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.delete<ResponsePayload>(API_SUB_CATEGORY + 'delete/' + id, {params});
  }

  deleteMultipleThemeSubCategoryById(ids: string[], checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.post<ResponsePayload>(API_SUB_CATEGORY + 'delete-multiple', {ids: ids}, {params});
  }


}
