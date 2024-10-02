
export default {
  /* 
    pages.itelemetry.devices,
    pages.itelemetry.sensors,
    pages.itelemetry.recors,
  */
 devices: {
    //permission: '',
    activated: true,
    authenticated: true,
    path: '/telemetry/devices/index',
    name: 'qtelemetry.admin.devices',
    crud : import('modules/qtelemetry/_crud/devices'),
    page: () => import('modules/qcrud/_pages/admin/crudPage'),
    layout: () => import('layouts/master.vue'),
    title: 'itelemetry.cms.sidebar.adminDevices',
    icon: 'fa-light fa-mobile-signal-out',
    subHeader: {
        refresh: true,
    }
  },
  
}
