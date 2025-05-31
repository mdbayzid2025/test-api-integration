import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {ResponsePayload} from '../../interfaces/core/response-payload.interface';
import {FilterData} from '../../interfaces/gallery/filter-data';
import {Observable} from "rxjs";
import {Package} from "../../interfaces/common/package.interface";


const API_URL = environment.apiBaseLink + '/api/package/';


@Injectable({
  providedIn: 'root'
})
export class PackageService {

  constructor(
    private httpClient: HttpClient
  ) {
  }

  /**
   * addPackage
   * insertManyPackage
   * getAllPackages
   * getPackageById
   * updatePackageById
   * updateMultiplePackageById
   * deletePackageById
   * deleteMultiplePackageById
   */

  addPackage(data: Package):Observable<ResponsePayload> {
    return this.httpClient.post<ResponsePayload>(API_URL + 'add', data);
  }

  getAllPackage(filterData: FilterData, searchQuery?: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    return this.httpClient.post<{ data: Package[], count: number, success: boolean }>(API_URL + 'get-all/', filterData, {params});
  }

  getPackageById(id: string, select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.get<{ data: Package, message: string, success: boolean }>(API_URL + 'get-by/'+id, {params});
  }

  updatePackageById(id: string, data: Package) {
    return this.httpClient.put<{ message: string, success: boolean }>(API_URL + 'update/' + id, data);
  }

  updateMultiplePackageById(ids: string[], data: Package) {
    const mData = {...{ids: ids}, ...data}
    return this.httpClient.put<ResponsePayload>(API_URL + 'update-multiple', mData);
  }


  deletePackageById(id: string, checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.delete<ResponsePayload>(API_URL + 'delete/' + id, {params});
  }

  deleteMultiplePackageById(ids: string[], checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.post<ResponsePayload>(API_URL + 'delete-multiple', {ids: ids}, {params});
  }

}
