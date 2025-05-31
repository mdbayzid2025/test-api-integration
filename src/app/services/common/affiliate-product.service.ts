import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ResponsePayload } from '../../interfaces/core/response-payload.interface';
import { AffiliateProduct } from '../../interfaces/common/affiliate-product.interface';
import { FilterData } from "../../interfaces/gallery/filter-data";

const API_BASE_URL = environment.apiBaseLink + '/api/affiliate-product/';


@Injectable({
  providedIn: 'root'
})
export class AffiliateProductService {

  constructor(
    private httpClient: HttpClient
  ) {
  }

  /**
   * addAffiliateProduct
   * insertManyAffiliateProduct
   * getAllAffiliateProducts
   * getAffiliateProductById
   * updateAffiliateProductById
   * updateMultipleAffiliateProductById
   * deleteAffiliateProductById
   * deleteMultipleAffiliateProductById
   */

  addAffiliateProduct(data: AffiliateProduct) {
    return this.httpClient.post<ResponsePayload>
    (API_BASE_URL + 'add-by-admin', data);
  }


  getAllAffiliateProducts(filterData: FilterData, searchQuery?: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    return this.httpClient.post<{ data: AffiliateProduct[], count: number, success: boolean }>(API_BASE_URL + 'get-all', filterData, {params});
  }

  getAffiliateProductById(id: string, select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.get<{ data: AffiliateProduct, message: string, success: boolean }>(API_BASE_URL + 'get-by-id/' + id, {params});
  }

  getAllAffiliateProductsSaleReport(id: string, select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.get<{ data: any, message: string, success: boolean }>(API_BASE_URL + 'get-all-sale-report-by-affiliate/' + id, {params});
  }



  updateAffiliateProductById(id: string, data: AffiliateProduct) {
    return this.httpClient.put<{ message: string, success: boolean }>(API_BASE_URL + 'update/' + id, data);
  }

  updateMultipleAffiliateProductById(ids: string[], data: AffiliateProduct) {
    const mData = {...{ids: ids}, ...data}
    return this.httpClient.put<ResponsePayload>(API_BASE_URL + 'update-multiple', mData);
  }

  deleteAffiliateProductById(id: string, checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.delete<ResponsePayload>(API_BASE_URL + 'delete/' + id, {params});
  }

  deleteMultipleAffiliateProductById(ids: string[], checkUsage?: boolean) {
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
