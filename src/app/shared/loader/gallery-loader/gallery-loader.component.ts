import { Component } from '@angular/core';
import {NgxSkeletonLoaderModule} from 'ngx-skeleton-loader';

@Component({
  selector: 'app-gallery-loader',
  standalone: true,
  imports: [
    NgxSkeletonLoaderModule
  ],
  templateUrl: './gallery-loader.component.html',
  styleUrl: './gallery-loader.component.scss'
})
export class GalleryLoaderComponent {

}
