import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { UiService } from '../core/ui.service';
import { DATABASE_KEY } from '../../core/utils/global-variable';
import { StorageService } from '../core/storage.service';
import { Admin, AdminAuthResponse } from '../../interfaces/common/admin.interface';
import { UtilsService } from '../core/utils.service';
import { environment } from '../../../environments/environment';
import { AdminPermissions } from '../../enum/admin-permission.enum';

const API_URL = environment.apiBaseLink + '/api/admin/';

@Injectable({
  providedIn: 'root',
})
export class AdminService {

  private token: string;
  private isAdmin = false;
  private adminId: string = null;
  private adminRole: string = null;
  private adminPermissions: AdminPermissions[] = null;
  private adminStatusListener = new Subject<boolean>();

  // Hold The Count Time
  private tokenTimer: any;

  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private uiService: UiService,
    private utilsService: UtilsService,
    private storageService: StorageService,
  ) {
  }

  /**
   * MAIN API METHODS
   * adminLogin()
   * autoAdminLoggedIn()
   * getLoggedInAdminData()
   */
  adminLogin(data: { username: string, password: string }) {
    return new Promise((resolve, reject) => {
      this.httpClient.post<AdminAuthResponse>
        (API_URL + 'login', data)
        .subscribe({
          next: res => {
            if (res.success) {
              this.token = res.token;
              if (res.data) {
                this.adminId = res.data._id;
                this.adminRole = res.data.role;
                this.adminPermissions = res.data.permissions;
              }
              // When Token
              if (this.token) {
                this.isAdmin = true;
                this.adminStatusListener.next(true);
                const expiredInDays = Number(res.tokenExpiredInDays.replace('d', ''));
                this.setSessionTimer(expiredInDays * 86400000);
                const now = new Date();
                const expirationDate = this.utilsService.getNextDateString(new Date(now.getTime() - 3600 * 1000), expiredInDays);
                // Store to Local
                this.saveAdminData(res.token, expirationDate, this.adminId, this.adminRole, this.adminPermissions);
                // Snack bar..
                this.uiService.message(res.message, 'success');

                // Navigate..
                this.router.navigate([environment.adminBaseUrl]).then();
                resolve(res);
              }
            } else {
              this.uiService.message(res.message, 'wrong');
              this.adminStatusListener.next(false);
              reject()
            }
          },
          error: err => {
            this.adminStatusListener.next(false);
            reject(err);
          }
        })
    })

  }

  autoAdminLoggedIn() {
    const authInformation = this.getAdminData();
    if (!authInformation) {
      this.storageService.removeDataFromEncryptLocal(DATABASE_KEY.encryptAdminLogin);
      return;
    }
    const now = new Date();
    const expDate = new Date(authInformation.expiredDate);
    const expiresIn = expDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.adminStatusListener.next(true);
      this.isAdmin = true;
      this.adminId = authInformation.adminId;
      this.adminRole = authInformation.role;
      this.adminPermissions = authInformation.permissions;
      this.setSessionTimer(expiresIn);
    }
  }

  getLoggedInAdminData(select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }

    return this.httpClient.get<{ data: Admin }>(API_URL + 'logged-in-admin-data', { params });
  }


  /**
   * AUTH METHODS
   * getAdminStatus()
   * getAdminToken()
   * getAdminId()
   * getAdminStatusListener()
   * adminLogOut()
   */
  getAdminStatus() {
    return this.isAdmin;
  }

  getAdminToken() {
    return this.token;
  }

  getAdminId() {
    return this.adminId;
  }

  getAdminRole() {
    return this.adminRole;
  }

  getAdminPermissions() {
    return this.adminPermissions;
  }

  getAdminStatusListener() {
    return this.adminStatusListener.asObservable();
  }

  adminLogOut() {
    this.token = null;
    this.isAdmin = false;
    this.adminStatusListener.next(false);
    this.clearAdminData();
    clearTimeout(this.tokenTimer);
    this.router.navigate([environment.adminLoginUrl]).then();
  }


  /**
   * Save Admin Info Encrypt to Local
   * saveAdminData()
   * clearAdminData()
   * getAdminData()
   * setSessionTimer()
   */
  protected saveAdminData(token: string, expiredDate: Date, adminId: string, role: string, permissions: AdminPermissions[]) {
    const data = {
      token,
      expiredDate,
      adminId,
      role,
      permissions
    };
    this.storageService.addDataToEncryptLocal(data, DATABASE_KEY.encryptAdminLogin);
  }

  protected clearAdminData() {
    this.storageService.removeDataFromEncryptLocal(DATABASE_KEY.encryptAdminLogin);
  }

  protected getAdminData() {
    return this.storageService.getDataFromEncryptLocal(DATABASE_KEY.encryptAdminLogin);
  }

  private setSessionTimer(durationInMs: number) {
    this.tokenTimer = setTimeout(() => {
      this.adminLogOut();
    }, durationInMs); // 1s = 1000ms
  }


}
