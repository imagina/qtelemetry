import pages from 'src/setup/pages'

//task
export default [
    {
      title: 'itelemetry.cms.sidebar.adminGroup',
      icon: 'fa-light fa-satellite-dish',
      children: [
        pages.qtelemetry.devices,
        pages.qtelemetry.sensors,
        //pages.itelemetry.records,
      ]
    },
  ]
  