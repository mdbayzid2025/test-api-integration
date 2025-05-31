import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {ResponsePayload} from '../../interfaces/core/response-payload.interface';
import {FilterData} from '../../interfaces/gallery/filter-data';
import {Project} from '../../interfaces/common/project.interface';

const API_URL = environment.apiBaseLink + '/api/project/';


@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(
    private httpClient: HttpClient
  ) {
  }

  /**
   * addProject()
   * insertManyProject()
   * getAllProjects()
   * getProjectById()
   * updateProjectById()
   * updateMultipleProjectById()
   * deleteProjectById()
   * deleteMultipleProjectById()
   */

  addProject(data: Project) {
    return this.httpClient.post<ResponsePayload>
    (API_URL + 'add', data);
  }

  insertManyProject(data: Project, option?: any) {
    const mData = {data, option}
    return this.httpClient.post<ResponsePayload>
    (API_URL + 'insert-many', mData);
  }

  analysisMultipleProject(data: any[]) {
    return this.httpClient.post<ResponsePayload>
    (API_URL + 'analysis-multiple-projects', data);
  }

 updateMultipleProject(data: any[]) {
    return this.httpClient.post<ResponsePayload>
    (API_URL + 'update-multiple-projects', data);
  }

  getAllProjects(filterData: FilterData, searchQuery?: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    return this.httpClient.post<{ data: Project[], count: number, success: boolean }>(API_URL + 'get-all', filterData, {params});
  }

  getProjectById(id: string, select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.get<{ data: Project, message: string, success: boolean }>(API_URL + 'get-by/' + id, {params});
  }

  updateProjectByIdAnalyzer(id: string, data: Project) {
    return this.httpClient.put<{ message: string, success: boolean }>(API_URL + 'update-by-analyzer/' + id, data);
  }

  updateProjectById(id: string, data: Project) {
    return this.httpClient.put<{ message: string, success: boolean }>(API_URL + 'update/' + id, data);
  }

  updateMultipleProjectById(ids: string[], data: Project) {
    const mData = {...{ids: ids}, ...data}
    return this.httpClient.put<ResponsePayload>(API_URL + 'update-multiple', mData);
  }

  deleteProjectById(id: string, checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.delete<ResponsePayload>(API_URL + 'delete/' + id, {params});
  }

  deleteMultipleProjectById(ids: string[], checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.post<ResponsePayload>(API_URL + 'delete-multiple', {ids: ids}, {params});
  }


}
