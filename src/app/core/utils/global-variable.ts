import {environment} from '../../../environments/environment';

export const DATABASE_KEY = Object.freeze({
  loginToken: 'SOFTLAB_QA_TOKEN_' + environment.VERSION,
  loggInSession: 'SOFTLAB_QA_SESSION_' + environment.VERSION,
  loginTokenAdmin: 'SOFTLAB_QA_ADMIN_TOKEN_' + environment.VERSION,
  loggInSessionAdmin: 'SOFTLAB_QA_ADMIN_SESSION_' + environment.VERSION,
  encryptAdminLogin: 'SOFTLAB_QA_USER_0_' + environment.VERSION,
  encryptUserLogin: 'SOFTLAB_QA_USER_1_' + environment.VERSION,
  loginAdminRole: 'SOFTLAB_QA_ADMIN_ROLE_' + environment.VERSION,
  cartsProduct: 'SOFTLAB_QA_USER_CART_' + environment.VERSION,
  productFormData: 'SOFTLAB_QA_PRODUCT_FORM_' + environment.VERSION,
  userCart: 'SOFTLAB_QA_USER_CART_' + environment.VERSION,
  recommendedProduct: 'SOFTLAB_QA_RECOMMENDED_PRODUCT_' + environment.VERSION,
  userCoupon: 'SOFTLAB_QA_USER_COUPON_' + environment.VERSION,
  userCookieTerm: 'SOFTLAB_QA_COOKIE_TERM' + environment.VERSION,
});
