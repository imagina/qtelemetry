
export default {

 devices: {
    permission: 'itelemetry.devices.manage',
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

  devicesMap: {
    permission: 'itelemetry.devices.manage',
    activated: true,
    authenticated: true,
    path: '/telemetry/devices/map',
    name: 'qtelemetry.admin.devicesMap',
    page: () => import('modules/qtelemetry/_pages/devices/map'),
    layout: () => import('layouts/master.vue'),
    title: 'itelemetry.cms.sidebar.adminDevicesMap',
    icon: 'fa-light fa-map',
    subHeader: {
        refresh: true,
    }
  },

  sensors: {
    permission: 'itelemetry.sensors.manage',
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

  records: {
    permission: 'itelemetry.records.manage',
    activated: true,
    authenticated: true,
    path: '/telemetry/records/index',
    name: 'qtelemetry.admin.records',
    //crud : import('modules/qtelemetry/_crud/records'),
    page: () => import('modules/qtelemetry/_pages/records'),
    layout: () => import('layouts/master.vue'),
    title: 'itelemetry.cms.sidebar.adminRecords',
    icon: 'fa-light fa-signal-stream',
    subHeader: {
        refresh: true,
    }
  },

  graphs: {
    permission: 'itelemetry.records.manage',
    activated: true,
    authenticated: true,
    path: '/telemetry/graphs/index',
    name: 'qtelemetry.admin.graphs',
    //crud : import('modules/qtelemetry/_crud/records'),
    page: () => import('modules/qtelemetry/_pages/graphs'),
    layout: () => import('layouts/master.vue'),
    title: 'itelemetry.cms.sidebar.adminGraphs',
    icon: 'fa-light fa-chart-area',
    subHeader: {
        refresh: true,
    }
  },

}
