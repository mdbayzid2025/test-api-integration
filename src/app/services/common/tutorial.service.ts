import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {ResponsePayload} from '../../interfaces/core/response-payload.interface';
import {FilterData} from '../../interfaces/gallery/filter-data';
import {Observable} from "rxjs";
import {Tutorial} from "../../interfaces/common/tutorial.interface";


const API_URL = environment.apiBaseLink + '/api/tutorial/';


@Injectable({
  providedIn: 'root'
})
export class TutorialService {

  constructor(
    private httpClient: HttpClient
  ) {
  }

  /**
   * addTutorial
   * insertManyTutorial
   * getAllTutorials
   * getTutorialById
   * updateTutorialById
   * updateMultipleTutorialById
   * deleteTutorialById
   * deleteMultipleTutorialById
   */

  addTutorial(data: Tutorial):Observable<ResponsePayload> {
    return this.httpClient.post<ResponsePayload>(API_URL + 'add', data);
  }

  addManyTutorial(data: Tutorial[]):Observable<ResponsePayload> {
    return this.httpClient.post<ResponsePayload>(API_URL + 'insert-many', {data});
  }

  getAllTutorial(filterData: FilterData, searchQuery?: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    return this.httpClient.post<{ data: Tutorial[], count: number, success: boolean }>(API_URL + 'get-all/', filterData, {params});
  }

  getTutorialById(id: string, select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.get<{ data: Tutorial, message: string, success: boolean }>(API_URL + 'get-by/'+id, {params});
  }

  updateTutorialById(id: string, data: Tutorial) {
    return this.httpClient.put<{ message: string, success: boolean }>(API_URL + 'update/' + id, data);
  }

  updateMultipleTutorialById(ids: string[], data: Tutorial) {
    const mData = {...{ids: ids}, ...data}
    return this.httpClient.put<ResponsePayload>(API_URL + 'update-multiple', mData);
  }


  deleteTutorialById(id: string, checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.delete<ResponsePayload>(API_URL + 'delete/' + id, {params});
  }

  deleteMultipleTutorialById(ids: string[], checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.post<ResponsePayload>(API_URL + 'delete-multiple', {ids: ids}, {params});
  }

}
