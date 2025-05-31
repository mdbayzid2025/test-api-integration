import {Select} from '../../interfaces/core/select';
import {FileTypes} from "../../enum/file-types.enum";


export const defaultUploadImage = '/assets/images/avatar/image-upload.jpg';

export const DATA_BOOLEAN: Select[] = [
  {value: true, viewValue: 'Yes'},
  {value: false, viewValue: 'No'},
];


export const CLONE_URLS: Select[] = [
  {value: 'gadgetshob.saleecom.shop', viewValue: 'gadgetshob.saleecom.shop'},
  {value: 'levoleather.saleecom.shop', viewValue: 'levoleather.saleecom.shop'},
  {value: 'prideshop.saleecom.shop', viewValue: 'prideshop.saleecom.shop'},
  {value: 'veraglow.saleecom.shop', viewValue: 'veraglow.saleecom.shop'},
  {value: 'halalfoods.saleecom.shop', viewValue: 'halalfoods.saleecom.shop'},
  {value: 'klothen.saleecom.shop', viewValue: 'klothen.saleecom.shop'},
  {value: 'rangsworld.saleecom.shop', viewValue: 'rangsworld.saleecom.shop'},
  {value: 'shajgojbd.saleecom.shop', viewValue: 'shajgojbd.saleecom.shop'},
  {value: 'karukarjobd.saleecom.shop', viewValue: 'karukarjobd.saleecom.shop'},
  {value: 'cosmeceuticals.saleecom.shop', viewValue: 'cosmeceuticals.saleecom.shop'},
  {value: 'ghorershop.saleecom.shop', viewValue: 'ghorershop.saleecom.shop'},
  {value: 'furniturebd.saleecom.shop', viewValue: 'furniturebd.saleecom.shop'},
  {value: 'amsafeskin.com', viewValue: 'amsafeskin.com'},
  {value: 'mosimosi.sg', viewValue: 'mosimosi.sg'},
];

export const ADMIN_ROLES: Select[] = [
  {value: 'super_admin', viewValue: 'Admin'},
  {value: 'admin', viewValue: 'Manager'},
  {value: 'editor', viewValue: 'User'},
];

export const FILE_TYPES: Select[] = [
  {value: FileTypes.IMAGE, viewValue: 'Image'},
  {value: FileTypes.VIDEO, viewValue: 'Video'},
  {value: FileTypes.PDF, viewValue: 'Pdf'}
];

export const DISCOUNT_TYPES: Select[] = [
  {
    value: 'percentage',
    viewValue: 'Percentage'
  },
  {
    value: 'cash',
    viewValue: 'Cash'
  },
];

export const PACKAGE_TYPES: Select[] = [
  {
    value: 'Free',
    viewValue: 'Free'
  },
  {
    value: 'Popular',
    viewValue: 'Popular'
  },{
    value: 'Advance',
    viewValue: 'Advance'
  },
];

export const TABLE_TAB_ORDER_DATA: Select[] = [
  { value: 'all', viewValue: 'All Data'},
  { value: 'owner', viewValue: 'Owner'},
  { value: 'others', viewValue: 'Others'},

];

export const DATA_STATUS: Select[] = [
  {value: 'publish', viewValue: 'Publish'},
  {value: 'draft', viewValue: 'Draft'},
];


export const THEME_DATA_STATUS: Select[] = [
  {value: 'free', viewValue: 'Free'},
  {value: 'professional', viewValue: 'Professional'},
  {value: 'premium', viewValue: 'Premium'},
];
export const DATA_Payment: Select[] = [
  {value: 'paid', viewValue: 'Paid'},
  {value: 'unpaid', viewValue: 'Un Paid'},
];
export const TABLE_TAB_DATA: Select[] = [
  {viewValue: "All Data", value: 'all'},
  {viewValue: "Publish", value: 'publish'},
  {viewValue: "Draft", value: 'draft'},
  {viewValue: "Trash", value: 'trash'},
];
export const DATA_STATUS_AVAILABILITY: Select[] = [
  {value: 'available', viewValue: 'Available'},
  {value: 'upcoming', viewValue: 'Upcoming'},
];


export const THEME_CUSTOM_OPTIONS: Select[] = [
  {value: 'headerViews', viewValue: 'Header Section'},
  {value: 'showcaseViews', viewValue: 'Showcase Section'},
  {value: 'categoryViews', viewValue: 'Category Section'},
  {value: 'brandViews', viewValue: 'Brand Section'},
  {value: 'productViews', viewValue: 'Product Section'},
  {value: 'productCardViews', viewValue: 'Product Card'},
];

export const PAGE_CUSTOM_OPTIONS: Select[] = [
  {value: 'checkout', viewValue: 'Checkout'},
  {value: 'productDetails', viewValue: 'Product Details'},
];

export const THEME_CUSTOM_OPTIONS_SELECT_TYPES: Select[] = [
  {value: 'single', viewValue: 'Single'},
  {value: 'multiple', viewValue: 'Multiple'},
];

export const SHOP_TYPES: Select[] = [
  {value: 'demo', viewValue: 'Demo'},
  {value: 'free', viewValue: 'Free'},
  {value: 'professional', viewValue: 'Professional'},
  {value: 'premium', viewValue: 'Premium'},
];

export const DATA_STATUS_2: Select[] = [
  {value: 'publish', viewValue: 'Active'},
  {value: 'draft', viewValue: 'Inactive'},
  {value: 'running', viewValue: 'Running'},
];

export const REPLY_STATUS: Select[] = [
  {value: 'Mail Sent', viewValue: 'Mail Sent'},
  {value: 'Negotiation', viewValue: 'Negotiation'},
  {value: 'Positive', viewValue: 'Positive'},
  {value: 'Negative', viewValue: 'Negative'},
  {value: 'Others', viewValue: 'Others'},
  {value: 'Wrong Email', viewValue: 'Wrong Email'},
  {value: 'Late Respond', viewValue: 'Late Respond'},
];


export const DOMAIN_TYPES: Select[] = [
    {
      value: 'sub-domain',
      viewValue: 'Sub Domain'
    },
    {
      value: 'domain',
      viewValue: 'Main Domain-https'
    },

    {
      value: 'domain-http-www',
      viewValue: 'Main Domain-http-www'
    },

    {
      value: 'domain-www-http',
      viewValue: 'Main Domain-www-http'
    },
  ];



export const MONTHS: Select[] = [
  {value: 1, viewValue: 'January'},
  {value: 2, viewValue: 'February'},
  {value: 3, viewValue: 'March'},
  {value: 4, viewValue: 'April'},
  {value: 5, viewValue: 'May'},
  {value: 6, viewValue: 'June'},
  {value: 7, viewValue: 'July'},
  {value: 8, viewValue: 'August'},
  {value: 9, viewValue: 'September'},
  {value: 10, viewValue: 'October'},
  {value: 11, viewValue: 'November'},
  {value: 12, viewValue: 'December'},
];



export const YEARS: Select[] = [
  {value: 2024, viewValue: '2024'},
  {value: 2023, viewValue: '2023'},
  {value: 2022, viewValue: '2022'},
];

export const GENDERS: Select[] = [
  {value: 'male', viewValue: 'Male'},
  {value: 'female', viewValue: 'Female'},
  {value: 'others', viewValue: 'Others'},
];


export const PAYMENT_METHODS: Select[] = [
  {value: 'Bkash', viewValue: 'Bkash'},
  {value: 'Nagad', viewValue: 'Nagad'},
  {value: 'Rocket', viewValue: 'Rocket'},
  {value: 'SSL', viewValue: 'SSL'},
  {value: 'Card', viewValue: 'Card'},
];

export const THEME_CATEGORIES = [
  {
    _id: '1',
    name: 'E-commerce',
  }
]

export const THEME_SUB_CATEGORIES = [
  {
    _id: '1',
    category: '1',
    name: 'Electronics',
  },
  {
    _id: '2',
    category: '1',
    name: 'Clothing',
  }
]


export const OVERVIEW_FILTER: Select[] = [
  {
    value: 'today',
    viewValue: 'Today'
  },
  {
    value: 'lastDays',
    viewValue: 'Last Days'
  },
  {
    value: 'thisWeek',
    viewValue: 'This Week'
  },
  {
    value: 'lastWeek',
    viewValue: 'Last Week'
  },
  {
    value: 'last7Days',
    viewValue: 'Last 7 Days'
  },
  {
    value: 'last15Days',
    viewValue: 'Last 15 Days'
  },
  {
    value: 'last30Days',
    viewValue: 'Last 30 Days'
  },
  {
    value: 'thisMonth',
    viewValue: 'This Month'
  },
  {
    value: 'lastMonth',
    viewValue: 'Last Month'
  },
];

