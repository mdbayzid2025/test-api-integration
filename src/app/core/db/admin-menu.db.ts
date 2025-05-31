import {MenuItemInterface} from '../../interfaces/common/menu-item.interface';

export const ADMIN_MENU_DB: MenuItemInterface[] = [
  {
    id: '1',
    title: 'Analyzers',
    topIcon: '/assets/images/svg/excel-icon.svg',
    totalLength: '0',
    bodyBgPrimary: 'linear-gradient(to right, #9F57FD, #CF66E3)',
    footerBgPrimary: '#C03DE0',
    buttonPrimaryBg: '#C03DE0',
    buttonActiveBg: '#B92ADB',
    listUrl: 'analyzers',
    addUrl: 'analyzers',
  },
  {
    id: '2',
    title: 'Project',
    topIcon: '/assets/images/svg/project-icon.svg',
    totalLength: '767',
    bodyBgPrimary: 'linear-gradient(to right, #2e9ff5, #5cb1f0)',
    footerBgPrimary: '#0094ef',
    buttonPrimaryBg: '#0094ef',
    buttonActiveBg: '#008ae8',
    listUrl: 'projects',
    addUrl: 'projects/add',
  },
  {
    id: '3',
    title: 'Black List',
    topIcon: '/assets/images/svg/project-icon.svg',
    totalLength: '767',
    bodyBgPrimary: 'linear-gradient(to right, #F58862, #FB984C)',
    footerBgPrimary: '#F47E2F',
    buttonPrimaryBg: '#F47E2F',
    buttonActiveBg: '#ED701B',
    listUrl: 'projects/black-list',
    addUrl: 'projects/add-blacklist',
  },

  {
    id: '4',
    title: 'Customer',
    topIcon: '/assets/images/svg/admin-icon.svg',
    totalLength: '767',
    bodyBgPrimary: 'linear-gradient(to right, #26C0B6, #39DB9F)',
    footerBgPrimary: '#18D181',
    buttonPrimaryBg: '#18D181',
    buttonActiveBg: '#0CC676',
    listUrl: 'users',
    addUrl: 'users/add',
  },

];
