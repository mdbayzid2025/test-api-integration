import {Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss'
})
export class PaginationComponent implements OnChanges {
  @Input() totalData: number = 1;     // Example default value
  @Input() dataPerPage: number = 1;    // Example default value
  @Output() pageChange = new EventEmitter();

  totalPages: number = 1;
  currentPage: number = 1;

  ngOnChanges() {
    this.calculateTotalPages();
  }

  calculateTotalPages() {
    this.totalPages = Math.ceil(this.totalData / this.dataPerPage);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
    this.pageChange.emit(this.currentPage);
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
    this.pageChange.emit(this.currentPage);
  }

  onPageInputChange() {
    if (this.currentPage < 1) {
      this.currentPage = 1;
    } else if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages;
    }
    this.pageChange.emit(this.currentPage);
  }
}
