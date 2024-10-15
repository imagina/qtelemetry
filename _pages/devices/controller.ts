import {computed, reactive, ref, onMounted, toRefs, watch, getCurrentInstance} from "vue";
import services from 'modules/qtelemetry/_pages/devices/services'
import recordServices from 'modules/qtelemetry/_pages/graphs/services'
import { i18n } from 'src/plugins/utils';


export default function controller(props: any, emit: any) {

  // Refs
  const refs = {
    // refKey: ref(defaultValue)
  }

  // States
  const state = reactive({
    // Key: Default Value
    loading: false,
    map: null, 
    devices: [],
    mapField: {
      value: null,
      type: 'positionMarkerMap',
      help: { description: i18n.tr('icommerce.cms.form.mapHelp') },      
      props: {
        label: `${i18n.tr('isite.cms.label.search')}...`,
        readOnly: true, 
        markers: true,
        height: '80vh'
      }
    }
  })

  // Computed
  const computeds = {
    // key: computed(() => {})
  }

  // Methods
  const methods = {
    // methodKey: () => {}
    init(){
      state.loading = true
      methods.getDevices().then(response => {
        methods.setMarkers();
        state.loading = false;
      })
    },
    setMarkers(){
      state.map = state.devices.map(device => {
        return {
          lat: device.lat,
          lng: device.lng,
          title: device.title,
          loadingLabel: i18n.tr('isite.cms.label.loading'),
          onClick: () => methods.getLastRecord(device)
        }
      })
    },
    getLastRecord(device){
      return new Promise((resolve, reject) => {
        const sensorParams = {
          filter: {
            deviceId: device.id
          }
        }
        recordServices.getSensors(sensorParams).then(response => {
          const sensors = response
          const params = {
            filter: {
              deviceId: device.id,
            },
            orderBy: {
              field: 'id',
              way: 'desc'
            },
            take: 1
          }
          recordServices.getRecords(params).then(response => {
            if(response.length == 0 ) resolve('-')
            const record = response[0]
            const title = `<b>${record?.device?.title}</b>` || '-'
            let data = ''
            //build the data for popUp
            if(sensors.length){
              sensors.forEach(s => {
                if(record?.logs){
                  const log = record.logs.find(l => l.sensorId == s.id)
                  if(log){
                    let text = s.title
                    const options  = s.options
                    if(options){
                      text = options?.prefix ?  options.prefix : s.title
                      text = options?.suffix ?  `${text} : ${log.value} ${options.suffix}` : `${text} : ${log.value}`
                    } else {
                      text = `${text} : ${log.value}`
                    }
                    data = `${data} ${text}</br>`
                  }
                }
              });
            }
            resolve(`${title}<p>${data}</p>`)
          })
        })
      })
    },
    getDevices(){
      return new Promise((resolve, reject) => {
        services.getDevices().then(response => {
          state.devices = response
          resolve(response)
        })
      })
    }
  }

  // Mounted
  onMounted(() => {
    methods.init()
  })

  // Watch
  // watch(key, (newField, oldField): void => {
  //
  // }, {deep: true})

  return {...refs, ...(toRefs(state)), ...computeds, ...methods}
}
