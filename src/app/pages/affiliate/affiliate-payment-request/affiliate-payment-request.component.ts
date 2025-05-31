import {Component, inject, OnInit, ViewChild} from '@angular/core';
import {NgForm} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {Pagination} from "../../../interfaces/core/pagination";
import {FilterData} from "../../../interfaces/gallery/filter-data";
import {AffiliateReportsService} from "../../../services/common/affiliate-reports.service";
import {debounceTime, distinctUntilChanged, map,filter, Subscription} from "rxjs";
import {AdminService} from "../../../services/common/admin.service";
import {MatDialog} from "@angular/material/dialog";
import {
  AffiliatePaymentClaimFormComponent
} from "./affiliate-payment-claim-form/affiliate-payment-claim-form.component";

@Component({
  selector: 'app-affiliate-payment-request',
  templateUrl: './affiliate-payment-request.component.html',
  styleUrl: './affiliate-payment-request.component.scss'
})
export class AffiliatePaymentRequestComponent implements OnInit {
  // Decorator
  @ViewChild('searchForm', {static: true}) private searchForm: NgForm;

  // Search Query
  searchQuery = null;

  // Sort
  private sortQuery = {createdAt: -1};

  // Pagination
  currentPage = 1;
  totalData = 0;
  dataPerPage = 100;
  totalAmount = 0;


  // Filter
  filter: any = null;

  affiliatePaymentRequests: any;
  // Store Data
  userId: string;
  ownerId: string = "6274ed609bd5046b86bfd2a3";
  type: string = "withdrawal";

  private readonly select: any = {
    amount: 1,
    createdAt: 1,
    affiliate: 1,
    paymentMethod: 1,
    note: 1,
    dateString: 1,
    status: 1,
    ownerId: 1,
    ownerType: 1,
    image: 1,
    method: 1,

  }



  // Loading Control
  isLoading: boolean = true;
  private reqStartTime: Date = null;
  private reqEndTime: Date = null;

// Subscriptions
  private subDataGetAll: Subscription;
  private subscriptions: Subscription[] = [];

// Inject
  private readonly router = inject(Router);
  private readonly affiliateReportsService = inject(AffiliateReportsService);
  private readonly adminService = inject(AdminService);
  private readonly dialog = inject(MatDialog);
  private readonly activatedRoute = inject(ActivatedRoute);

  ngOnInit(): void {

    // Get Data from Query Params and Load Data
    const subActivateRoute = this.activatedRoute.queryParamMap.subscribe(qParam => {
      this.currentPage = Number(qParam.get('page')) || 1;
      this.searchQuery = qParam.get('search') || '';
      this.getAffiliatePaymentRequest();

    });
    this.subscriptions.push(subActivateRoute);



  }

  ngAfterViewInit(): void {

    const formValue = this.searchForm.valueChanges;
    const subSearch = formValue.pipe(
      map((t: any) => t['searchTerm']),
      filter(() => this.searchForm.valid),
      debounceTime(500),
      distinctUntilChanged(),
    ).subscribe((searchTerm: string) => {
      if (searchTerm) {
        // Update query params with the new search term
        this.router.navigate([], {
          queryParams: { search: searchTerm },
          queryParamsHandling: 'merge'
        }).then();
      } else {
        // Remove search query param when input is empty
        this.router.navigate([], {
          queryParams: { search: null },
          queryParamsHandling: 'merge'
        }).then();
      }
    });

    this.subscriptions.push(subSearch);
  }



  private getAffiliatePaymentRequest(){
    const pagination: Pagination = {
      pageSize: Number(this.dataPerPage),
      currentPage: Number(this.currentPage) - 1
    };

    const filterData: FilterData = {
      pagination: pagination,
      filter: {...this.filter,...{ownerId: this.adminService.getAdminId(),type:this.type,status:'requested'}},
      select: this.select,
      sort: this.sortQuery
    }

    // Start Request Time
    this.reqStartTime = new Date();

    this.subDataGetAll = this.affiliateReportsService.getAllAffiliateReports(filterData, this.searchQuery)
      .subscribe({
        next: res => {
          this.affiliatePaymentRequests = res.data;
          this.totalAmount = res.totalAmount;
          this.isLoading = false;

        },
        error: err => {
          this.isLoading = false;
          console.log(err)
        }
      })

  }

  onClearSearch() {
    this.searchForm.reset();
    this.searchQuery = null;
    this.router.navigate([], {queryParams: {search: null}}).then();
  }


  openPaymentRequestDialog(data: any): void {
    const dialogRef = this.dialog.open(AffiliatePaymentClaimFormComponent, {
      data: data,
      width: '500px', // optional
      disableClose: false // optional
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Dialog result:', result); // ✅ এখানে তুমি response পাবে
        // তুমি এখানে result অনুযায়ী action নিতে পারো
        this.getAffiliatePaymentRequest()
      }
    });
  }

  /**
   * PAGINATION CHANGE
   * onPageChanged()
   */
  public onPageChanged(event: any) {
    this.router.navigate([], { queryParams: { page: event } }).then();
  }
}
