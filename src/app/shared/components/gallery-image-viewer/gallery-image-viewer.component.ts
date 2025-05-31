import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-gallery-image-viewer',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './gallery-image-viewer.component.html',
  styleUrl: './gallery-image-viewer.component.scss'
})
export class GalleryImageViewerComponent implements OnChanges {

  // Decorator
  @Input() images: string[] = [];
  @Input() startIndex: number | undefined;
  @Output() closeEvent = new EventEmitter<void>();

  // Store Data
  currentIndex: number = 0;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['startIndex'] && this.startIndex !== undefined && this.images.length > 0) {
      this.setIndex(this.startIndex);
    }
  }

  /**
   * Other Methods
   * setIndex()
   * prevImage()
   * nextImage()
   * close()
   */
  setIndex(index: number): void {
    if (index >= 0 && index < this.images.length) {
      this.currentIndex = index;
    } else {
      this.currentIndex = 0;
    }
  }

  prevImage(): void {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    } else {
      this.currentIndex = this.images.length - 1;
    }
  }

  nextImage(): void {
    if (this.currentIndex < this.images.length - 1) {
      this.currentIndex++;
    } else {
      this.currentIndex = 0;
    }
  }

  close(): void {
    this.closeEvent.emit();
  }
}
