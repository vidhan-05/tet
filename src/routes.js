import { element } from 'prop-types'
import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Users = React.lazy(() => import('./views/base/users/users'))
const Events = React.lazy(() => import('./views/base/events/events'))
const announcements = React.lazy(() => import('./views/base/announcements/announcements'))
const publication = React.lazy(() => import('./views/base/publication/publication'))
const matrimonial = React.lazy(() => import('./views/base/matrimonial/matrimonial'))
const ads = React.lazy(() => import('./views/base/ads/ads'))
const businessconnect = React.lazy(() => import('./views/base/businessconnect/businessconnect'))
const donors = React.lazy(() => import('./views/base/donors/donors'))
const post = React.lazy(() => import('./views/base/post/post'))
const country = React.lazy(() => import('./views/base/country/country'))
const state = React.lazy(() => import('./views/base/state/state'))
const city = React.lazy(() => import('./views/base/city/city'))
const feedback = React.lazy(() => import('./views/base/feedback/feedback'))
const notification = React.lazy(() => import('./views/base/notification/notification'))
const settings = React.lazy(()=> import('./views/base/settings/setting'))
const Allusers = React.lazy(()=> import('./views/base/Allusers/Allusers'))
const Admin  = React.lazy(()=> import('./views/base/admin/admin'))
const Profile = React.lazy(()=> import('./views/base/Profile/profile'))
const EditProfile =  React.lazy(()=> import('./views/base/Profile/Editprofile'))
const DeletedUsers = React.lazy(()=>import('./views/base/deletedUsers/deletedusers'))
const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard, protected: true },
  { path: '/base/users', name: 'Users', element: Users, protected: true },
  {path: '/base/allusers', name:  'All Users', element: Allusers, protected: true},
  { path: '/base/events', name: 'Events', element: Events, protected: true },
  { path: '/base/announcements', name: 'Announcements', element: announcements, protected: true },
  { path: '/base/publication', name: 'publication', element: publication, protected: true },
  { path: '/base/matrimonial', name: 'Matrimonial', element: matrimonial, protected: true },
  { path: '/base/ads', name: 'ads', element: ads, protected: true },
  { path: '/base/edit-profile', name: 'Edit Profile', element: EditProfile , protected: true },
  {path : '/base/adminusers', name : 'Admin' , element : Admin, protected : true},
  {
    path: '/base/businessconnect',
    name: 'BusinessConnect',
    element: businessconnect,
    protected: true,
  },
  
  { path: '/base/donors', name: 'Donors', element: donors, protected: true },
  { path: '/base/post', name: 'Posts', element: post, protected: true },
  { path: '/base/country', name: 'Country', element: country, protected: true },
  { path: '/base/state', name: 'State', element: state, protected: true },
  { path: '/base/city', name: 'City', element: city, protected: true },
  { path: '/base/feedback', name: 'Feedback', element: feedback, protected: true },
  { path: '/base/notification', name: 'Notification', element: notification, protected: true },
  {path: '/base/settings', name:  'Settings', element: settings, protected: true},
  { path: '/base/profile', name: 'Profile', element:Profile , protected: true },
  { path: '/base/deleted_users', name: 'Deleted User', element:DeletedUsers, protected: true },
]

export default routes
