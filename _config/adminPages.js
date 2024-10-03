
export default {

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
  sensors: {
    //permission: '',
    activated: true,
    authenticated: true,
    path: '/telemetry/sensors/index',
    name: 'qtelemetry.admin.sensors',
    crud : import('modules/qtelemetry/_crud/sensors'),
    page: () => import('modules/qcrud/_pages/admin/crudPage'),
    layout: () => import('layouts/master.vue'),
    title: 'itelemetry.cms.sidebar.adminSensors',
    icon: 'fa-light fa-tower-cell',
    subHeader: {
        refresh: true,
    }
  },
  
}
