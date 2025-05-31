import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {ResponsePayload} from '../../interfaces/core/response-payload.interface';
import {FilterData} from '../../interfaces/gallery/filter-data';
import {Observable} from "rxjs";
import {Product} from "../../interfaces/common/product.interface";


const API_URL = environment.apiBaseLink + '/api/product/';


@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(
    private httpClient: HttpClient
  ) {
  }

  /**
   * addProduct
   * insertManyProduct
   * getAllProducts
   * getProductById
   * updateProductById
   * updateMultipleProductById
   * deleteProductById
   * deleteMultipleProductById
   */

  addProduct(data: Product):Observable<ResponsePayload> {
    return this.httpClient.post<ResponsePayload>(API_URL + 'add', data);
  }

  getAllProduct(filterData: FilterData, searchQuery?: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    return this.httpClient.post<{ data: Product[], count: number, success: boolean }>(API_URL + 'get-all/', filterData, {params});
  }

  getProductById(id: string, select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.get<{ data: Product, message: string, success: boolean }>(API_URL + 'get-by/'+id, {params});
  }

  updateProductById(id: string, data: Product) {
    return this.httpClient.put<{ message: string, success: boolean }>(API_URL + 'update/' + id, data);
  }

  updateMultipleProductById(ids: string[], data: Product) {
    const mData = {...{ids: ids}, ...data}
    return this.httpClient.put<ResponsePayload>(API_URL + 'update-multiple', mData);
  }


  deleteProductById(id: string, checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.delete<ResponsePayload>(API_URL + 'delete/' + id, {params});
  }

  deleteMultipleProductById(ids: string[], checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.post<ResponsePayload>(API_URL + 'delete-multiple', {ids: ids}, {params});
  }

}
