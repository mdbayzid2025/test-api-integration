import {inject} from '@angular/core';
import {AdminPermissions} from '../enum/admin-permission.enum';
import {AdminService} from '../services/common/admin.service';

interface Constructor<T = {}> {
  new(...args: any[]): T;
}
/**
 * REF:
 * https://medium.com/@saif.adnan/typescript-mixin-ee962be3224d#:~:text=In%20TypeScript%2C%20a%20mixin%20is%20a%20way%20to%20combine%20multiple,creating%20a%20deep%20inheritance%20hierarchy.&text=const%20greeter%20%3D%20new%20MyGreeter()%3B,greeter.
 */
export function adminBaseMixin<T extends Constructor>(Base: T) {
  return class extends Base {
    private adminId: string;
    private role: string;
    private permissions: AdminPermissions[];

    protected  readonly adminService = inject(AdminService);

    constructor(...args: any[]) {
      super(...args);
      this.getAdminBaseData();
    }


     private getAdminBaseData() {
      this.adminId = this.adminService.getAdminId();
      this.role = this.adminService.getAdminRole();
      this.permissions = this.adminService.getAdminPermissions();
    }

    get checkAddPermission(): boolean {
      return this.permissions.includes(AdminPermissions.CREATE);
    }

    get checkDeletePermission(): boolean {
      return this.permissions.includes(AdminPermissions.DELETE);
    }

    get checkEditPermission(): boolean {
      return this.permissions.includes(AdminPermissions.EDIT);
    }
    get checkRole(): string {
      return this.role;
    }

  };
}

