import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {PagesComponent} from './pages.component';

const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
        // data: { animation: 'HomePage' },
      },
      /**
       * Website Build
       */
      {
        path: 'website-builder/add-website',
        loadChildren: () => import('./website-builder/add-website/add-website.module').then(m => m.AddWebsiteModule)
      },

      {
        path: 'website-builder/update-website',
        loadChildren: () => import('./website-builder/update-website/update-website.module').then(m => m.UpdateWebsiteModule)
      },

      {
        path: 'support',
        loadChildren: () => import('./support/support.module').then(m => m.SupportModule),
      },


      /**
       * Others
       */
      {
        path: 'theme',
        loadChildren: () => import('./theme/theme.module').then(m => m.ThemeModule)
      },
      {
        path: 'port',
        loadChildren: () => import('./port/port.module').then(m => m.PortModule)
      },
      {
        path: 'tutorial',
        loadChildren: () => import('./tutorial/tutorial.module').then(m => m.TutorialModule)
      },
      {
        path:"address",
        loadChildren:() => import('./address/address.module').then(m => m.AddressModule)
      },
      {
        path:"package",
        loadChildren:() => import('./package/package.module').then(m => m.PackageModule)
      },
      {
        path:"shop",
        loadChildren:() => import('./shop/shop.module').then(m => m.ShopModule)
      },
      {
        path:"image",
        loadChildren:() => import('./upload-image/upload-image.module').then(m => m.UploadImageModule)
      },
      {
        path:"product",
        loadChildren:() => import('./product/product.module').then(m => m.ProductModule)
      },
      {
        path:"subscription-report",
        loadChildren:() => import('./subscription-report/subscription-report.module').then(m => m.SubscriptionReportModule)
      },
      {
        path:"subscription",
        loadChildren:() => import('./subscription/subscription.module').then(m => m.SubscriptionModule)
      },
      {
        path: 'analyzers',
        loadChildren: () => import('./analyzer/analyzer.module').then(m => m.AnalyzerModule),
        // data: { animation: 'AboutPage' },
      },
      {
        path: 'gallery',
        loadChildren: () => import('./gallery/gallery.module').then(m => m.GalleryModule),
      },
      /*
      * MY GALLERY
      */

      {
        path: 'my-gallery',
        loadChildren: () => import('./my-gallery/my-gallery.module').then(m => m.MyGalleryModule)
      },
      {
        path: 'my-gallery/folders',
        loadChildren: () => import('./my-gallery/folder/all-folders/all-folders.module').then(m => m.AllFoldersModule)
      },
      {
        path: 'my-gallery/add-folder',
        loadChildren: () => import('./my-gallery/folder/add-folder/add-folder.module').then(m => m.AddFolderModule)
      },
      {
        path: 'my-gallery/edit-folder/:id',
        loadChildren: () => import('./my-gallery/folder/add-folder/add-folder.module').then(m => m.AddFolderModule)
      },

      {
        path: 'projects',
        loadChildren: () => import('./project/project.module').then(m => m.ProjectModule),
        // data: { animation: 'AboutPage' },
      },
      {
        path: 'users',
        loadChildren: () => import('./user/user.module').then(m => m.UserModule),
        // data: { animation: 'AboutPage' },
      },
      {
        path: 'admin',
        loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
        // data: { animation: 'AboutPage' },
      },
      {
        path: 'vendor',
        loadChildren: () => import('./vendor/vendor.module').then(m => m.VendorModule),
        // data: { animation: 'AboutPage' },
      },
      {
        path: 'affiliate',
        loadChildren: () => import('./affiliate/affiliate.module').then(m => m.AffiliateModule),
        // data: { animation: 'AboutPage' },
      },
      {
        path: 'affiliate-product',
        loadChildren: () => import('./affiliate-product/affiliate-product.module').then(m => m.AffiliateProductModule),
        // data: { animation: 'AboutPage' },
      },
      {
        path: 'payment-link',
        loadChildren: () => import('./payment-link/payment-link.module').then(m => m.PaymentLinkModule),
        // data: { animation: 'AboutPage' },
      },
      {
        path: 'profile',
        loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule)
      },
      {
        path: 'category',
        loadChildren: () => import('./category/category.module').then(m => m.CategoryModule)
      },
      {
        path: 'announcement',
        loadChildren: () => import('./announcement/announcement.module').then(m => m.AnnouncementModule)
      },
      {
        path: 'test',
        loadChildren: () => import('./test/test.module').then(m => m.TestModule)
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
