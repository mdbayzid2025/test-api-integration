import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient, HttpParams} from "@angular/common/http";
import {FilterData} from "../../interfaces/gallery/filter-data";
import {AffiliateProduct} from "../../interfaces/common/affiliate-product.interface";


const API_BASE_URL = environment.apiBaseLink + '/api/affiliate-report/';

@Injectable({
  providedIn: 'root'
})
export class AffiliateReportsService {

  constructor(
    private httpClient:  HttpClient
  ) {}


  getAllAffiliateReports(filterData: FilterData, searchQuery?: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    return this.httpClient.post<{
      totalAmount: number;
      data: AffiliateProduct[], count: number, success: boolean }>(API_BASE_URL + 'get-all', filterData, {params});
  }
}
