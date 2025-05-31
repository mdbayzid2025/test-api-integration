import {Component, Inject, inject, Input, OnDestroy, OnInit, Optional, TemplateRef, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {PageDataService} from "../../services/core/page-data.service";
import {Title} from "@angular/platform-browser";
import {FilterData} from "../../interfaces/gallery/filter-data";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {NavBreadcrumb} from "../../interfaces/core/nav-breadcrumb.interface";
import {Support} from "../../interfaces/common/support.interface";
import {Subscription} from "rxjs";
import {SupportService} from '../../services/common/support.service';
import {ConfirmDialogComponent} from '../../shared/components/ui/confirm-dialog/confirm-dialog.component';
import {UiService} from '../../services/core/ui.service';
import {Select} from '../../interfaces/core/select';
import {VendorService} from '../../services/common/vendor.service';
import {SHOP_TYPES} from "../../core/utils/app-data";
import {Admin} from "../../interfaces/common/admin.interface";
import {AdminDataService} from "../../services/common/admin-data.service";
import {Pagination} from "../../interfaces/core/pagination";
import {Clipboard} from "@angular/cdk/clipboard";

@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrl: './support.component.scss',
  animations: [
    trigger('fadeIn', [
      state('hidden', style({
        opacity: 0,
        transform: 'translateY(20px)'
      })),
      state('visible', style({
        opacity: 1,
        transform: 'translateY(0)'
      })),
      transition('hidden => visible', [
        animate('300ms ease-out')
      ])
    ])
  ]
})
export class SupportComponent implements OnInit, OnDestroy {
  // Decorator
  @Input() navArray: NavBreadcrumb[] = [];
  @ViewChild('supportDialog') supportDialogTemplate!: TemplateRef<any>;

  private refreshIntervalId: any;



  // Store Data
  selectedSupportData: Support;
  filterTabs: any[] = [
    {key: 'all', label: 'All'},
    {key: 'issue', label: 'Issue'},
    {key: 'feedback', label: 'Feedback'},
    {key: 'feature', label: 'Feature'},
  ];

  filterStatusTabs: any[] = [
    {key: 'all', label: 'All'},
    {key: 'Pending', label: 'Pending'},
    {key: 'Approved', label: 'Approved'},
    {key: 'Working On It', label: 'Working On It'},
    {key: 'Follow Up', label: 'Follow Up'},
    {key: 'Resolved', label: 'Resolved'},
  ];

  statusData: Select[] = [
    {
      value: 'Pending',
      viewValue: 'Pending'
    },
    {
      value: 'Approved',
      viewValue: 'Approved'
    },
    {
      value: 'Working On It',
      viewValue: 'Working On It'
    },
    {
      value: 'Follow Up',
      viewValue: 'Follow Up'
    } ,
    {
      value: 'Resolved',
      viewValue: 'Resolved'
    }
  ]


  assignUser: any;
  selectedStatus: any;
  note: any;
  // Sort
  private sortQuery = { createdAt: -1 };

  activeSort: number = null;
  activeTab: string = 'all';
  activeTab2: string = 'all';
  searchQuery = null;
  protected allTableData: Support[] = [];
  protected holdPrevData: Support[] = [];
  allAdmin: Admin[] = [];
  support: Support;
  protected isLoadingData: boolean = false;
  protected isLoading: boolean = false;

  // FilterData
  filter: any = null;
  activeFilter1: number = null;
  activeFilter2: number = null;

  // Pagination
  totalDataStore = 0;

  currentPage = 1;
  totalData = 0;
  // galleriesMaxLimit = 0;

  dataPerPage = 12;

  // Select
  private readonly select: any = {
    type: 1,
    description: 1,
    status: 1,
    assignUser: 1,
    images: 1,
    resolveDate: 1,
    createdAt: 1,
    shop: 1,
  }

  // Inject
  private readonly pageDataService = inject(PageDataService);
  private readonly title = inject(Title);
  private readonly supportService = inject(SupportService);
  private readonly dialog = inject(MatDialog);
  private readonly uiService = inject(UiService);
  private readonly vendorService = inject(VendorService);
  private readonly adminDataService = inject(AdminDataService);
  private readonly clipboard = inject(Clipboard);

  // Subscriptions
  private subscriptions: Subscription[] = [];

  constructor(
    @Optional() public dialogRef: MatDialogRef<SupportComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public dialogData: { type: string, count?: number }
  ) {
  }

  ngOnInit() {
    // Base Data
    this.getAllSupports();
    this.setPageData();
    this.getAllAdmin();

    // Call API every 10 minutes (600,000 ms)
    this.refreshIntervalId = setInterval(() => {
      this.getAllSupports();
      this.getAllAdmin();
    }, 600000);
  }


  /**
   * Page Data
   * setPageData()
   */
  private setPageData(): void {
    this.title.setTitle('Support');
    this.pageDataService.setPageData({
      title: 'Support',
      navArray: [
        {name: 'Dashboard', url: `/dashboard`},
        {name: 'Support', url: 'https://www.youtube.com/embed/SBpMHyb0qOE?si=xriw1UQ3APQP8wfW'},
      ]
    })
  }


  /**
   * HTTP REQ HANDLE
   * getAllSupports()
   */

  private getAllSupports(loadMore?: boolean) {
    this.isLoadingData = true;
    const pagination: any = {
      pageSize: Number(this.dataPerPage),
      currentPage: Number(this.currentPage) - 1
    };

    const filterData: FilterData = {
      pagination: pagination,
      filter: this.filter,
      select: this.select,
      sort: {createdAt: -1}
    }


    const subscription = this.supportService.getAllSupports(filterData, this.searchQuery)
      .subscribe({
        next: res => {
          if (loadMore) {
            // Same API loading logic as above...
            const newGalleries = res.data.map(gallery => ({
              ...gallery,
              state: 'hidden' // Initially hidden for animation
            }));
            this.totalData = res?.count;
            this.allTableData = [...this.allTableData, ...newGalleries];
            this.allTableData.forEach(item => item.descriptionShort = this.truncateHtmlToPlainText(item.description));

            // Trigger animation by setting the state to 'visible' after the data loads
            setTimeout(() => {
              this.allTableData.forEach(gallery => gallery.state = 'visible');
            }, 50);

            // this.galleries = [...this.galleries, ...res.data];
            this.isLoading = false;
          } else {
            this.allTableData = res.data;
            this.allTableData.forEach(item => item.descriptionShort = this.truncateHtmlToPlainText(item.description));
          }

          this.totalData = res.count;
          if (!this.searchQuery) {
            this.holdPrevData = this.allTableData;
            this.totalDataStore = res.count;
          }
          this.isLoadingData = false;
        }, error: err => {
          // this.isLoadingData = false;
          console.log(err)
        }
      });
    this.subscriptions.push(subscription);
  }

  private getAllAdmin() {
    const pagination: Pagination = {
      pageSize: Number(this.dataPerPage),
      currentPage: Number(this.currentPage) - 1
    };

    const mSelect = {
      name: 1,
      phoneNo: 1,
    }

    const filterData: FilterData = {
      pagination: pagination,
      filter: {role:'editor'},
      select: mSelect,
      sort: this.sortQuery
    }



 this.adminDataService.getAllAdmins(filterData, this.searchQuery)
      .subscribe({
        next: res => {
          this.allAdmin = res.data;

        },
        error: err => {
          // this.isLoading = false;
          console.log(err)
        }
      })
  }


  /**
   * LOAD MORE
   * loadMoreGalleries()
   */
  loadMoreGalleries() {
    if (this.isLoading || this.allTableData.length >= this.totalData) return;
    this.isLoading = true;
    this.currentPage += 1;
    this.getAllSupports(true);
  }


  truncateHtmlToPlainText(html: string, maxLength: number = 200): string {
    if (!html) return '';

    const div = document.createElement('div');
    div.innerHTML = html;

    // Add spaces between block-level elements and inline content
    const walker = document.createTreeWalker(div, NodeFilter.SHOW_TEXT, null);
    let text = '';
    while (walker.nextNode()) {
      text += walker.currentNode.textContent + ' ';
    }

    // Normalize spacing
    const normalized = text.replace(/\s+/g, ' ').trim();

    // Trim to max length
    return normalized.length > maxLength
      ? normalized.slice(0, maxLength).trim() + '...'
      : normalized;
  }


  openFullView(data: Support): void {
    this.selectedSupportData = data;

    this.dialog.open(this.supportDialogTemplate, {
      data,
      maxWidth: '95vw',
      width: '700px',
      maxHeight: '90vh',
      panelClass: 'support-dialog-full',
      autoFocus: false,
      disableClose: true,
    });
  }

  /**
   * COMPONENT DIALOG VIEW
   * openConfirmDialog()
   * openDetailsDialog()
   */
  public openConfirmDialog(type: string, data?: any) {
    if (type === 'delete') {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        maxWidth: '400px',
        data: {
          title: 'Confirm Delete',
          message: 'Are you sure you want delete this data?'
        }
      });
      dialogRef.afterClosed().subscribe(dialogResult => {
        if (dialogResult) {

          this.deleteMultipleSupportById([data]);
        }
      });

    }
  }

  private deleteMultipleSupportById(ids: string[]) {
    const subscription = this.supportService.deleteMultipleSupportById(ids)
      .subscribe({
        next: res => {
          if (res.success) {
            this.uiService.message(res.message, 'success');
            this.getAllSupports();
          } else {
            this.uiService.message(res.message, 'warn')
          }
        },
        error: err => {
          console.log(err)
        }
      });
    this.subscriptions.push(subscription);
  }

  public getSupportById(id: string) {
    const subscription = this.supportService.getSupportById(id).subscribe({
      next: (res) => {
        if (res.data) {
          this.support = res.data;
          if (this.support) {
            this.selectedStatus = this.support.status;
            this.note = this.support.note;
            this.assignUser = this.support.assignUser ?? null;
            this.openFullView(this.support);
          }
        }
      },
      error: (error) => {
        console.log(error);
      },
    });
    this.subscriptions.push(subscription);
  }

  protected updateSupportById(data: any) {

    const mData = {
      status: this.selectedStatus,
      assignUser: this.assignUser,
      note: this.note,
      resolveDate: this.selectedStatus === 'Resolved' ? new Date() : null,
    }
    const subscription = this.supportService.updateSupport(data._id, mData)
      .subscribe({
        next: (res) => {
          if (res.success) {
            this.uiService.message(res.message, 'success');
            this.assignUser = null;
            this.selectedStatus = null;
            this.note = null;
            this.dialog.closeAll();
            // this.getAllSupports();
            const index = this.allTableData.findIndex(item => item._id === data._id);
            if (index !== -1) {
              this.allTableData[index] = { ...this.allTableData[index], ...mData };
            }
          } else {
            this.uiService.message(res.message, 'warn');
          }
        },
        error: (error) => {
          console.log(error);
        },
      });
    this.subscriptions.push(subscription);
  }

  onDialogClose() {
    this.assignUser = null;
    this.selectedStatus = null;
    this.dialog.closeAll();
  }


  /**
   * Filter Data
   * onFilterChange()
   */
  onFilterChange(field: 'type' | 'status', value: string): void {
    if (field === 'type') this.activeTab = value;
    if (field === 'status') this.activeTab2 = value;

    this.filter = this.filter || {};

    if (value === 'all') {
      delete this.filter[field];
    } else {
      this.filter[field] = value;
    }

    if (Object.keys(this.filter).length === 0) {
      this.filter = null;
    }
    this.currentPage = 1;
    this.getAllSupports();
  }

  filterData(value: any, index: number, type: string) {
    switch (type) {
      case 'admin': {
        this.filter = {...this.filter, ...{'assignUser._id': value}};
        this.activeFilter2 = index;
        break;
      }

      default: {
        break;
      }
    }
this.getAllSupports()
  }




  // compare function
  compareUsers(u1: any, u2: any): boolean {
    return u1 && u2 && u1.phoneNo === u2.phoneNo;
  }

  adminLoginAsVendor(vendorId: any) {

    const data = {
      identifier: vendorId
    }

    this.vendorService.adminLoginAsVendor(data)
      .subscribe({
        next: async res => {

          if (res.success && res.token) {
            const vendorPanelURL = `https://admin.saleecom.com/login?token=${res.token}`;
            window.open(vendorPanelURL, '_blank');
          } else {

            this.uiService.message('Failed to login as vendor', 'wrong');
          }
        },
        error: err => {
          this.uiService.message(err?.error?.message[0], 'wrong');
          console.log(err)
        }
      })


  }



  /**
   * Table & Table Methods
   * onClearDataQuery()
   */
  onClearDataQuery() {
    this.activeSort = null;
    this.activeFilter1 = null;
    this.activeFilter2 = null;
    this.sortQuery = { createdAt: -1 };
    this.filter = null;

      this.getAllSupports();

  }

  copyToClipboard($event: Event, text: string): void {
    $event.stopPropagation();

    const fullUrl = `${text}`;
    this.clipboard.copy(fullUrl);
    this.uiService.message('Phone number copied successfully.', 'success');
  }

  /**
   * ON Destroy
   */
  ngOnDestroy() {
    if (this.refreshIntervalId) {
      clearInterval(this.refreshIntervalId);
    }
    this.subscriptions.forEach(sub => sub?.unsubscribe());
  }

  protected readonly shopTypes = SHOP_TYPES;
}
