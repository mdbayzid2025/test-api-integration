import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {ResponsePayload} from '../../interfaces/core/response-payload.interface';
import {FilterData} from '../../interfaces/gallery/filter-data';
import {map, Observable, switchMap, takeWhile, timer} from "rxjs";
import {Shop} from "../../interfaces/common/shop.interface";


const API_URL = environment.apiBaseLink + '/api/shop/';


@Injectable({
  providedIn: 'root'
})
export class PreShopService {

  constructor(
    private httpClient: HttpClient
  ) {
  }

  /**
   * addShop
   * insertManyShop
   * getAllShops
   * getShopById
   * updateShopById
   * updateMultipleShopById
   * deleteShopById
   * deleteMultipleShopById
   */

  createVendorAndShop(data: any):Observable<ResponsePayload> {
    return this.httpClient.post<ResponsePayload>(API_URL + 'create-vendor-and-shop', data);
  }

  versionUpdateByShop(id: string) {
    return this.httpClient.put<{ message: string, success: boolean }>(API_URL + 'version-update/' + id, {});
  }

  checkShopBuildStatusById(shopId: string) {
    return this.httpClient.get<{
      data: { buildStatus: string },
      success: boolean
    }>(API_URL + 'check-build-status/' + shopId);
  }

  checkShopBuildStatusByInterval(shopId: string, interval: number): Observable<any> {
    return new Observable(observer => {
      timer(0, interval).pipe(
        switchMap(() => this.httpClient.get<{
          data: { buildStatus: string},
          success: boolean
        }>(API_URL + 'check-build-status/' + shopId)),
        takeWhile(response => response?.data?.buildStatus !== 'secure', true),
        map(response => {
          if (response?.data?.buildStatus === 'secure') {
            return response;
          }
          return response;
        })
      ).subscribe({
        next: data => observer.next(data),
        error: error => observer.error(error),
        complete: () => observer.complete()
      })
    });
  }

  checkShopUpdateStatusByInterval(shopId: string, interval: number): Observable<any> {
    return new Observable(observer => {
      timer(0, interval).pipe(
        switchMap(() => this.httpClient.get<{
          data: { updateStatus: string},
          success: boolean
        }>(API_URL + 'check-build-status/' + shopId)),
        takeWhile(response => response?.data?.updateStatus !== 'updated', true),
        map(response => {
          if (response?.data?.updateStatus === 'updated') {
            return response;
          }
          return response;
        })
      ).subscribe({
        next: data => observer.next(data),
        error: error => observer.error(error),
        complete: () => observer.complete()
      })
    });
  }

  getAllShop(filterData: FilterData, searchQuery?: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    return this.httpClient.post<{ data: Shop[], count: number, success: boolean }>(API_URL + 'get-all-pre-shop/', filterData, {params});
  }

  smsSend(data: any) {
    return this.httpClient.post<{ data: any, message: string,success: boolean }>(API_URL + 'send-sms', data);
  }

  getShopById(id: string, select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.get<{ data: Shop, message: string, success: boolean }>(API_URL + 'get-by/'+id, {params});
  }

  updateShopById(id: string, data: Shop) {
    return this.httpClient.put<{ message: string, success: boolean }>(API_URL + 'update/' + id, data);
  }

  updateMultipleShopById(ids: string[], data: Shop) {
    const mData = {...{ids: ids}, ...data}
    return this.httpClient.put<ResponsePayload>(API_URL + 'update-multiple-pre-shop', mData);
  }


  deleteShop(data: any) {
    return this.httpClient.post<ResponsePayload>(API_URL + 'delete-shop', data);
  }

  deleteMultiplePreShopById(ids: string[], checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.post<ResponsePayload>(API_URL + 'delete-pre-multiple', {ids: ids}, {params});
  }

}
