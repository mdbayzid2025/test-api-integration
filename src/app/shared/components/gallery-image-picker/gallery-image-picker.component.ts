import {Component, EventEmitter, inject, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {NgStyle} from '@angular/common';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {Gallery} from '../../../interfaces/gallery/gallery.interface';
import {UtilsService} from '../../../services/core/utils.service';
import {GalleryImageViewerComponent} from '../gallery-image-viewer/gallery-image-viewer.component';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {GalleryModule} from '../../../pages/gallery/gallery.module';
import {MyGalleryComponent} from "../../../pages/my-gallery/my-gallery.component";

@Component({
  selector: 'app-gallery-image-picker',
  standalone: true,
  imports: [
    NgStyle,
    GalleryImageViewerComponent,
    GalleryModule
  ],
  templateUrl: './gallery-image-picker.component.html',
  styleUrls: ['./gallery-image-picker.component.scss']
})
export class GalleryImagePickerComponent implements OnInit, OnDestroy {

  // Decorator
  @Input() images: string[] = [];
  @Input() type: 'single' | 'multiple' = 'multiple';
  @Input() maxImages: number = 1;
  @Input() uploadInstruction: boolean = true;
  @Input() infoText: string = null;
  @Input() isInvalid: boolean = false;
  @Output() onPicked = new EventEmitter<any>();

  // Dialog Ref
  private galleryPickerDialogRef: MatDialogRef<MyGalleryComponent, any>;


  // Store Data
  isGalleryOpen: boolean = false;
  selectedImageIndex: number;
  private dragStartIndex: number | null = null;
  private draggedElement: HTMLElement | null = null;

  // Inject
  private readonly dialog = inject(MatDialog);
  private readonly utilsService = inject(UtilsService);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);

  // Subscription
  private subGalleryImageView: Subscription;

  ngOnInit() {
    // Gallery Image View handle
    this.subGalleryImageView = this.activatedRoute.queryParamMap.subscribe((qParam) => {
      // if (qParam.get('isOpenGalleryPicker') !== 'yes') {
      //   this.galleryPickerDialogRef.close();
      // }

      if (!qParam.get('gallery-image-view')) {
        this.closeGallery();
      }
    });
  }

  /**
   * Gallery Image Dialog
   * onUploadClick()
   * patchPickedImagesUnique()
   */

  onUploadClick() {
    // const dialogRef = this.dialog.open(AllImagesDialogComponent, {
    //   data: {type: this.type, count: this.images.length ? (this.maxImages - this.images.length) : this.maxImages},
    //   panelClass: ['theme-dialog', 'full-screen-modal-lg'],
    //   width: '100%',
    //   minHeight: '100%',
    //   autoFocus: false,
    //   disableClose: true
    // });
    this.router.navigate([], {queryParams: {isOpenGalleryPicker: 'yes'}, queryParamsHandling: ''}).then();

    this.galleryPickerDialogRef = this.dialog.open(MyGalleryComponent, {
      data: {type: this.type, count: this.images.length ? (this.maxImages - this.images.length) : this.maxImages},
      panelClass: ['theme-dialog', 'full-screen-modal-lg'],
      width: '100%',
      minHeight: '100%',
      autoFocus: false,
      disableClose: true
    });

    this.galleryPickerDialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        if (dialogResult.data && dialogResult.data.length > 0) {
          this.patchPickedImagesUnique(dialogResult.data);
        }
      }
    });
  }

  private patchPickedImagesUnique(images: Gallery[]) {
    if (this.images && this.images.length > 0) {
      const nImages = images.map(m => m.url);
      this.images = this.utilsService.mergeUniqueImages(this.images, nImages);
    } else {
      this.images = images.map(m => m.url);
    }
    this.onEmitData();
  }

  /**
   * Gallery Image View
   * openGallery()
   * closeGallery()
   */
  openGallery(index?: number): void {
    if (index) {
      this.selectedImageIndex = index;
    }
    this.isGalleryOpen = true;
    this.router.navigate([], {queryParams: {'gallery-image-view': true}, queryParamsHandling: 'merge'}).then();
  }

  closeGallery(): void {
    this.isGalleryOpen = false;
    this.router.navigate([], {queryParams: {'gallery-image-view': null}, queryParamsHandling: 'merge'}).then();
  }


  /**
   * DRAG & DROP CONTROL
   * onDragStart()
   * onDragOver()
   * onDrop()
   * onDragEnd()
   * resetDragState()
   */
  onDragStart(event: DragEvent, index: number) {
    this.dragStartIndex = index;
    this.draggedElement = event.target as HTMLElement;
    this.draggedElement.style.opacity = '0.5'; // Make it semi-transparent while dragging
    this.draggedElement.classList.add('dragging');
    event.dataTransfer?.setData('text/plain', index.toString());
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onDrop(event: DragEvent, index: number) {
    event.preventDefault();
    if (this.dragStartIndex !== null && this.dragStartIndex !== index) {
      const draggedImage = this.images[this.dragStartIndex];
      this.images.splice(this.dragStartIndex, 1);
      this.images.splice(index, 0, draggedImage);
    }
    this.resetDragState();
  }

  onDragEnd() {
    this.resetDragState();
    this.onEmitData();
  }

  private resetDragState() {
    if (this.draggedElement) {
      this.draggedElement.style.opacity = '1'; // Reset opacity
      this.draggedElement.classList.remove('dragging');
      this.draggedElement = null;
    }
    this.dragStartIndex = null;
  }

  /**
   * Other Methods
   * removeImage()
   * onEmitData()
   */
  removeImage(index: number) {
    this.images.splice(index, 1);
    this.onPicked.emit(this.images);
  }

  private onEmitData() {
    if (this.type === 'single' && this.images.length) {
      this.onPicked.emit(this.images[0]);
    } else if (this.type === 'multiple' && this.images.length) {
      this.onPicked.emit(this.images);
    }
  }

  /**
   * ON Destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe
    this.subGalleryImageView?.unsubscribe();
  }
}
