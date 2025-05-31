import { Directive, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';
import { debounceTime, fromEvent, map, Observable } from 'rxjs';

@Directive({
  selector: '[appInfiniteScroll]',
  standalone: true
})
export class InfiniteScrollDirective {

  @Output() scrollEnd = new EventEmitter<void>();

  constructor(private el: ElementRef) {
    this.initScrollEvent();
  }

  initScrollEvent() {
    fromEvent(this.el.nativeElement, 'scroll')
      .pipe(
        map(() => this.el.nativeElement.scrollTop + this.el.nativeElement.clientHeight >= this.el.nativeElement.scrollHeight - 200),
        debounceTime(50) // debounce scroll event to avoid multiple API calls
      )
      .subscribe((isBottom) => {
        if (isBottom) {
          this.scrollEnd.emit(); // Emit event when scrolled to the bottom
        }
      });
  }
}
