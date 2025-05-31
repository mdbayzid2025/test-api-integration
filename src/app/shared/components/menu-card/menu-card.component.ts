import {Component, Input} from '@angular/core';
import {TitleCasePipe, UpperCasePipe} from '@angular/common';
import {MenuItemInterface} from '../../../interfaces/common/menu-item.interface';
import {RouterLink} from '@angular/router';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'app-menu-card',
  standalone: true,
  imports: [
    UpperCasePipe,
    TitleCasePipe,
    RouterLink
  ],
  templateUrl: './menu-card.component.html',
  styleUrl: './menu-card.component.scss'
})
export class MenuCardComponent {
  readonly adminBaseUrl = environment.adminBaseUrl;
  @Input({required: true}) data: MenuItemInterface;


}
