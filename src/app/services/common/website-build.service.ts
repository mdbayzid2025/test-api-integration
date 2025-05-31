import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {ResponsePayload} from '../../interfaces/core/response-payload.interface';


const API_URL = environment.apiBaseLink + '/api/website-builder/';


@Injectable({
  providedIn: 'root'
})
export class WebsiteBuildService {


  constructor(
    private httpClient: HttpClient,
  ) {
  }

  /**
   * themeGitUpdate()
   * vendorPanelUpdateAndBuild()
   * adminPanelUpdateAndBuild()
   */

  themeGitUpdate() {
    return this.httpClient.post<ResponsePayload>(API_URL + 'theme-git-update', {});
  }

  vendorPanelUpdateAndBuild() {
    return this.httpClient.post<ResponsePayload>(API_URL + 'vendor-panel-update-and-build', {});
  }

  adminPanelUpdateAndBuild() {
    return this.httpClient.post<ResponsePayload>(API_URL + 'admin-panel-update-and-build', {});
  }


}
