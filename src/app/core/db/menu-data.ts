import { AdminMenu } from '../../interfaces/core/admin-menu.interface';


export const SUPER_ADMIN_MENU: AdminMenu[] = [
  {
    id: 0,
    name: 'Dashboard',
    hasSubMenu: false,
    routerLink: 'dashboard',
    icon: 'space_dashboard',
    subMenus: [],
  },
  {
    id: 907,
    name: 'Support',
    hasSubMenu: false,
    routerLink: 'support',
    icon: 'help',
    subMenus: [],
  },


  {
    id: 111,
    name: 'Website Builder',
    hasSubMenu: true,
    routerLink: null,
    icon: 'build',
    subMenus: [
      {
        id: 1,
        name: 'Add Website',
        hasSubMenu: true,
        routerLink: 'website-builder/add-website',
        icon: 'arrow_right',
      },
      {
        id: 1,
        name: 'Update Website',
        hasSubMenu: true,
        routerLink: 'website-builder/update-website',
        icon: 'arrow_right',
      },
    ],
  },
  {
    id: 115,
    name: 'Shop',
    hasSubMenu: true,
    routerLink: null,
    icon: 'shop',
    subMenus: [
      {
        id: 1,
        name: 'All Shop',
        hasSubMenu: true,
        routerLink: 'shop/all-shop',
        icon: 'arrow_right',
      },
      {
        id: 1,
        name: 'All Pre Shop',
        hasSubMenu: true,
        routerLink: 'shop/all-pre-shop',
        icon: 'arrow_right',
      },
      // {
      //   id: 3,
      //   name: 'All Shop Report',
      //   hasSubMenu: true,
      //   routerLink: 'shop/all-shop-report',
      //   icon: 'arrow_right',
      // },
    ],
  },
  {
    id: 112,
    name: 'Theme',
    hasSubMenu: true,
    routerLink: null,
    icon: 'assessment',
    subMenus: [
      {
        id: 1,
        name: 'All Theme',
        hasSubMenu: true,
        routerLink: 'theme/all-theme',
        icon: 'arrow_right',
      },
      {
        id: 2,
        name: 'Sub Categories',
        hasSubMenu: true,
        routerLink: 'theme/all-sub-categories',
        icon: 'arrow_right',
      },
      {
        id: 3,
        name: 'Categories',
        hasSubMenu: true,
        routerLink: 'theme/all-categories',
        icon: 'arrow_right',
      },

    ],
  },
  {
    id: 1123,
    name: 'Payment Link',
    hasSubMenu: true,
    routerLink: null,
    icon: 'credit_score',
    subMenus: [
      {
        id: 1,
        name: 'All Payment Links',
        hasSubMenu: true,
        routerLink: 'payment-link/all-payment-link',
        icon: 'arrow_right',
      },
      {
        id: 2,
        name: 'All Payment Links History',
        hasSubMenu: true,
        routerLink: 'payment-link/all-payment-link-history',
        icon: 'arrow_right',
      },
    ],
  },


  {
    id: 11334,
    name: 'Port',
    hasSubMenu: true,
    routerLink: null,
    icon: 'settings_applications',
    subMenus: [
      {
        id: 1,
        name: 'All Port',
        hasSubMenu: true,
        routerLink: 'port/all-port',
        icon: 'arrow_right',
      },
    ],
  },

  {
    id: 113366,
    name: 'Tutorial',
    hasSubMenu: true,
    routerLink: null,
    icon: 'smart_display',
    subMenus: [
      {
        id: 1,
        name: 'All tutorial',
        hasSubMenu: true,
        routerLink: 'tutorial/all-tutorial',
        icon: 'arrow_right',
      },
    ],
  },
  {
    id: 113,
    name: 'Package',
    hasSubMenu: true,
    routerLink: null,
    icon: 'settings_applications',
    subMenus: [
      {
        id: 1,
        name: 'All Package',
        hasSubMenu: true,
        routerLink: 'package/all-package',
        icon: 'arrow_right',
      },
    ],
  },
  {
    id: 114,
    name: 'Products',
    hasSubMenu: true,
    routerLink: null,
    icon: 'local_offer',
    subMenus: [
      {
        id: 1,
        name: 'Add Product',
        hasSubMenu: true,
        routerLink: 'product/add-product',
        icon: 'arrow_right',
      },
      {
        id: 2,
        name: 'All Product',
        hasSubMenu: true,
        routerLink: 'product/all-product',
        icon: 'arrow_right',
      },
    ],
  },

  {
    id: 116,
    name: 'Subscription',
    hasSubMenu: true,
    routerLink: null,
    icon: 'subscriptions',
    subMenus: [
      {
        id: 1,
        name: 'All Subscription',
        hasSubMenu: true,
        routerLink: 'subscription/all-subscription',
        icon: 'arrow_right',
      },
    ],
  },
  {
    id: 117,
    name: 'Subscription Report',
    hasSubMenu: true,
    routerLink: null,
    icon: 'assessment',
    subMenus: [
      {
        id: 1,
        name: 'All Subscription Report',
        hasSubMenu: true,
        routerLink: 'subscription-report/all-subscription-report',
        icon: 'arrow_right',
      },
      {
        id: 2,
        name: 'All Renew Report',
        hasSubMenu: true,
        routerLink: 'subscription-report/all-renew-report',
        icon: 'arrow_right',
      },
    ],
  },
  {
    id: 118,
    name: 'Customer',
    hasSubMenu: true,
    routerLink: null,
    icon: 'person_3',
    subMenus: [
      {
        id: 1,
        name: 'All Customer',
        hasSubMenu: true,
        routerLink: 'users/all-users',
        icon: 'arrow_right',
      },
    ],
  },
  {
    id: 119,
    name: 'Admin',
    hasSubMenu: true,
    routerLink: null,
    icon: 'assessment',
    subMenus: [
      {
        id: 1,
        name: 'All Admin',
        hasSubMenu: true,
        routerLink: 'admin/all-admin',
        icon: 'arrow_right',
      },
    ],
  },
  {
    id: 120,
    name: 'Vendor',
    hasSubMenu: true,
    routerLink: null,
    icon: 'assessment',
    subMenus: [
      {
        id: 1,
        name: 'All Vendor',
        hasSubMenu: true,
        routerLink: 'vendor/all-vendor',
        icon: 'arrow_right',
      },
    ],
  },
  {
    id: 1200,
    name: 'Affiliate User',
    hasSubMenu: true,
    routerLink: null,
    icon: 'supervisor_account',
    subMenus: [
      {
        id: 1,
        name: 'All Affiliate',
        hasSubMenu: true,
        routerLink: 'affiliate/all-affiliate',
        icon: 'arrow_right',
      },

      {
        id: 3,
        name: 'Affiliate Payment Request',
        hasSubMenu: true,
        routerLink: 'affiliate/affiliate-payment-request',
        icon: 'arrow_right',
      },
      {
        id: 4,
        name: 'Affiliate Request',
        hasSubMenu: true,
        routerLink: 'affiliate/affiliate-request',
        icon: 'arrow_right',
      },
      {
        id: 5,
        name: 'Affiliate Approved',
        hasSubMenu: true,
        routerLink: 'affiliate/all-approved-affiliate',
        icon: 'arrow_right',
      },

    ],
  },
  {
    id: 1120,
    name: 'Affiliate Product',
    hasSubMenu: true,
    routerLink: null,
    icon: 'conveyor_belt',
    subMenus: [
      {
        id: 1,
        name: 'All Affiliate Product',
        hasSubMenu: true,
        routerLink: 'affiliate-product/all-affiliate-product',
        icon: 'arrow_right',
      },
    ],
  },

  {
    id: 121,
    name: 'Announcement',
    hasSubMenu: true,
    routerLink: null,
    icon: 'announcement',
    subMenus: [
      {
        id: 1,
        name: 'All Announcement',
        hasSubMenu: true,
        routerLink: 'announcement/all-announcement',
        icon: 'arrow_right',
      },
    ],
  },
  {
    id: 5555,
    name: 'Gallery',
    hasSubMenu: true,
    routerLink: null,
    icon: 'collections',
    subMenus: [
      {
        id: 1,
        name: 'Images',
        hasSubMenu: true,
        routerLink: 'gallery/all-images',
        icon: 'arrow_right',
      },
      {
        id: 2,
        name: 'Folders',
        hasSubMenu: true,
        routerLink: 'gallery/all-folders',
        icon: 'arrow_right',
      },
    ],
  },
  {
    id: 122,
    name: 'Address',
    hasSubMenu: true,
    routerLink: null,
    icon: 'home',
    subMenus: [
      {
        id: 1,
        name: 'All District',
        hasSubMenu: true,
        routerLink: 'address/all-divisions',
        icon: 'arrow_right',
      },
      {
        id: 2,
        name: 'Area',
        hasSubMenu: true,
        routerLink: 'address/all-area',
        icon: 'arrow_right',
      },
      {
        id: 3,
        name: 'Zone',
        hasSubMenu: true,
        routerLink: 'address/all-zone',
        icon: 'arrow_right',
      }
    ],
  },
  {
    id: 123,
    name: 'Admin Control',
    hasSubMenu: true,
    routerLink: null,
    icon: 'admin_panel_settings',
    subMenus: [
      {
        id: 1,
        name: 'All Admin',
        hasSubMenu: true,
        routerLink: 'admin/all-admins',
        icon: 'arrow_right',
      },
    ],
  },

  {
    id: 124,
    name: 'Blog Area',
    hasSubMenu: true,
    routerLink: null,
    icon: 'rss_feed',
    subMenus: [
      {
        id: 1,
        name: 'Blog',
        hasSubMenu: true,
        routerLink: 'blog/all-blog',
        icon: 'arrow_right',
      },
      {
        id: 2,
        name: 'Blog Comment',
        hasSubMenu: true,
        routerLink: 'blog/all-comment',
        icon: 'arrow_right',
      },
    ],
  },
  {
    id: 125,
    name: 'Profile',
    hasSubMenu: false,
    routerLink: 'profile',
    icon: 'person',

    subMenus: [],
  },
];


export const EDITOR_MENU: AdminMenu[] = [
  {
    id: 0,
    name: 'Dashboard',
    hasSubMenu: false,
    routerLink: 'dashboard',
    icon: 'space_dashboard',
    subMenus: [],
  },
  {
    id: 907,
    name: 'Support',
    hasSubMenu: false,
    routerLink: 'support',
    icon: 'help',
    subMenus: [],
  },
  {
    id: 5555,
    name: 'Gallery',
    hasSubMenu: true,
    routerLink: null,
    icon: 'collections',
    subMenus: [
      {
        id: 1,
        name: 'Images',
        hasSubMenu: true,
        routerLink: 'gallery/all-images',
        icon: 'arrow_right',
      },
      {
        id: 2,
        name: 'Folders',
        hasSubMenu: true,
        routerLink: 'gallery/all-folders',
        icon: 'arrow_right',
      },
    ],
  },
  {
    id: 125,
    name: 'Profile',
    hasSubMenu: false,
    routerLink: 'profile',
    icon: 'person',

    subMenus: [],
  },
];
