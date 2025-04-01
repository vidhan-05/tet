// import { cilSpeedometer } from '@coreui/icons'
// import CIcon from '@coreui/icons-react'
// import { CNavItem, CNavTitle } from '@coreui/react'
// import React from 'react'

// const _nav = [

  
//   {
//     component: CNavItem,
//     name: 'Dashboard',  
//     to: '/dashboard',
//     icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
//   },
//   {
//     component: CNavTitle,
//     name: 'Modules',
//   },  
//   {
//     component: CNavItem,
//     name: 'All Users',
//     to: '/base/allusers'
//   },
//   {
//     component: CNavItem,
//     name: 'Users',
//     to: '/base/users',
//   },
//   {
//     component: CNavItem,
//     name: 'Events',
//     to: '/base/events',
//   },
//   {
//     component: CNavItem,
//     name: 'Announcements',
//     to: '/base/announcements',
//   },
//   {
//     component: CNavItem,
//     name: 'Publications',
//     to: '/base/publication',
//   },
//   {
//     component: CNavItem,
//     name: 'Matrimonial',
//     to: '/base/matrimonial',
//   },
//   {
//     component: CNavItem,
//     name: 'Ads',
//     to: '/base/ads',
//   },
//   {
//     component: CNavItem,
//     name: 'Business Connect',
//     to: '/base/businessconnect',
//   },
//   {
//     component: CNavItem,
//     name: 'Donors',
//     to: '/base/donors',
//   },
//   {
//     component: CNavItem,
//     name: 'Posts',
//     to: '/base/post',
//   },
//   {
//     component: CNavItem,
//     name: 'Country',
//     to: '/base/country',
//   },
//   {
//     component: CNavItem,
//     name: 'State',
//     to: '/base/state',
//   },
//   {
//     component: CNavItem,
//     name: 'City',
//     to: '/base/city',
//   },
//   {
//     component: CNavItem,
//     name: 'Feedback',
//     to: '/base/feedback',
//   },
//   {
//     component: CNavItem,
//     name: 'Notification',
//     to: '/base/notification',
//   },
// ]

// export default _nav











import { cilSpeedometer } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { CNavItem, CNavTitle } from '@coreui/react';
import React from 'react';

// Check localStorage for a specific value to determine whether to include the new module
const isAdmin = localStorage.getItem('type') === 'super admin';

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Modules',
  },
];

// Add "Admin Users" before "All Users" if the user is a super admin
if (isAdmin) {
  _nav.push({
    component: CNavItem,
    name: 'Admin Users',
    to: '/base/adminusers',
  });
}

_nav.push(
  {
    component: CNavItem,
    name: 'All Users',
    to: '/base/allusers',
  },
  {
    component: CNavItem,
    name: 'Family Head',
    to: '/base/users',
  },
  {
    component: CNavItem,
    name: 'Events',
    to: '/base/events',
  },
  {
    component: CNavItem,
    name: 'Announcements',
    to: '/base/announcements',
  },
  {
    component: CNavItem,
    name: 'Publications',
    to: '/base/publication',
  },
  {
    component: CNavItem,
    name: 'Matrimonial',
    to: '/base/matrimonial',
  },
  {
    component: CNavItem,
    name: 'Ads',
    to: '/base/ads',
  },
  {
    component: CNavItem,
    name: 'Business Connect',
    to: '/base/businessconnect',
  },
  {
    component: CNavItem,
    name: 'Donors',
    to: '/base/donors',
  },
  {
    component: CNavItem,
    name: 'Posts',
    to: '/base/post',
  },
);

if(isAdmin){
  _nav.push(  {
    component: CNavItem,
    name: 'Country',
    to: '/base/country',
  },
  {
    component: CNavItem,
    name: 'State',
    to: '/base/state',
  },
  {
    component: CNavItem,
    name: 'City',
    to: '/base/city',
  },
  {
    component: CNavItem,
    name: 'Feedback',
    to: '/base/feedback',
  },
  {
    component: CNavItem,
    name: 'Notification',
    to: '/base/notification',
  },
  {
    component : CNavItem,
    name: 'Deleted Users',
    to : '/base/deleted_users'

  }
);
}

export default _nav;
