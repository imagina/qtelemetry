import {computed, reactive, ref, onMounted, toRefs, watch, getCurrentInstance} from "vue";
import services from 'modules/qtelemetry/_pages/records/services'
import { store, i18n, clone, alert } from 'src/plugins/utils';

export default function controller(props: any, emit: any) {
  const proxy = getCurrentInstance()!.appContext.config.globalProperties

  // Refs
  const refs = {
    // refKey: ref(defaultValue)
  }

  // States
  const state = reactive({
    // Key: Default Value
    defaultCols: [
      {
        name: 'id', label: i18n.tr('isite.cms.form.id'), field: 'id', style: 'width: 50px'
      },
      {
        name: 'device', label: i18n.tr('itelemetry.cms.device'), field: 'device', align: 'rigth',
        format: val => val && val?.title ? val.title : '-'
      },
      {
        name: 'created_at', label: i18n.tr('isite.cms.form.createdAt'), field: 'createdAt', align: 'left',
        format: val => val ? i18n.trd(val) : '-',
      }
    ],
    columns: null, 
    sensors: null,
  })

  // Computed
  const computeds = {
    // key: computed(() => {})
  }

  // Methods
  const methods = {
    // methodKey: () => {}
    init(){
      methods.getSensors().then(response => {
        state.columns = methods.getColumns()
      })
    },
    getSensors(){
      return new Promise((resolve, reject) => {
        services.getSensors().then(response => {
          state.sensors = response;
          resolve(response)
        })
      })
    }, 
    getColumns() {
      const dynamicCols =   state.sensors.map((sensor) => {
        return {
          name: `sensor_${sensor.id}`,
          field: 'logs', 
          label: sensor.title,
          align: 'center',
          format: (val) => {
            if(val){
              const log = val.find((x) => x.sensorId == sensor.id )
              if(log && log?.value) return log.value
            }
            return '-'                
          },
        }
      })
      return [...state.defaultCols, ...dynamicCols]
    }, 
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
