import { Pipe, PipeTransform } from '@angular/core';
import {ADMIN_ROLES} from '../../core/utils/app-data';
import {Select} from '../../interfaces/core/select';

@Pipe({
  name: 'roleView',
  standalone: true
})
export class RoleViewPipe implements PipeTransform {

  private readonly roles: Select[] = ADMIN_ROLES;

  transform(value: string): string {
    const fRole =this.roles.find(f => f.value === value);
    return fRole ? fRole.viewValue  : '-';
  }

}
