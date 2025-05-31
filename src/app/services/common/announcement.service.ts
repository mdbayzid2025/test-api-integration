import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ResponsePayload } from '../../interfaces/core/response-payload.interface';
import { FilterData } from '../../interfaces/gallery/filter-data';
import { Observable } from "rxjs";
import { Announcement } from '../../interfaces/common/announcement.interface';


const API_URL = environment.apiBaseLink + '/api/announcement/';


@Injectable({
  providedIn: 'root'
})
export class AnnouncementService {

  constructor(
    private httpClient: HttpClient
  ) {
  }

  /**
   * addAnnouncement
   * insertManyAnnouncement
   * getAllAnnouncements
   * getAnnouncementById
   * updateAnnouncementById
   * updateMultipleAnnouncementById
   * deleteAnnouncementById
   * deleteMultipleAnnouncementById
   */

  addAnnouncement(data: Announcement): Observable<ResponsePayload> {
    return this.httpClient.post<ResponsePayload>(API_URL + 'add', data);
  }

  getAllAnnouncement(filterData: FilterData, searchQuery?: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    return this.httpClient.post<{ data: Announcement[], count: number, success: boolean }>(API_URL + 'get-all/', filterData, { params });
  }

  getAnnouncementById(id: string, select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.get<{ data: Announcement, message: string, success: boolean }>(API_URL + id, { params });
  }

  updateAnnouncementById(id: string, data: Announcement) {
    return this.httpClient.put<{ message: string, success: boolean }>(API_URL + 'update/' + id, data);
  }

  updateMultipleAnnouncementById(ids: string[], data: Announcement) {
    const mData = { ...{ ids: ids }, ...data }
    return this.httpClient.put<ResponsePayload>(API_URL + 'update-multiple', mData);
  }


  deleteAnnouncementById(id: string, checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.delete<ResponsePayload>(API_URL + 'delete/' + id, { params });
  }

  deleteMultipleAnnouncementById(ids: string[], checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.post<ResponsePayload>(API_URL + 'delete-multiple', { ids: ids }, { params });
  }

}
