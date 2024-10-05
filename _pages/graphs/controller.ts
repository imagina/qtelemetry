import {computed, reactive, ref, onMounted, toRefs, watch, getCurrentInstance} from "vue";
import services from 'modules/qtelemetry/_pages/graphs/services'
import { store, i18n, clone, alert } from 'src/plugins/utils';
import * as Plot from "@observablehq/plot";
import moment from "moment";

export default function controller(props: any, emit: any) {
  const proxy = getCurrentInstance()!.appContext.config.globalProperties

  const dateFormat = 'YYYY/MM/DD'

  // Refs
  const refs = {
    // refKey: ref(defaultValue)
  }

  // States
  const state = reactive({
    // Key: Default Value
    loading: false,
    columns: null, 
    sensors: null,
    records: null,
    dynamicFilterValues: {},
    dynamicFilters: {
      deviceId: {
        value: null,
        type: 'select',
        quickFilter: true,
        loadOptions: {
          apiRoute: 'apiRoutes.qtelemetry.devices',
          select: {label: 'title', id: 'id'},
        },
        props: {          
          label: `${i18n.tr('itelemetry.cms.form.devices')}`,
        }
      },
      /*
      date: {
        value: {
          type: 'customRange',
          from: moment().startOf('week').format(dateFormat),
          to: moment().endOf('week').format(dateFormat)
        },
        type: 'dateRange',
        quickFilter: true,
        props: {
          label: 'Date',
          clearable: false,
          removeTime: true,
          autoClose: true
        }
      },
      */
    },
    marks: [] 
    
  })

  // Computed
  const computeds = {
    // key: computed(() => {})
  }

  // Methods
  const methods = {
    // methodKey: () => {}
    init(){},
    updateDynamicFilterValues(filters){
      state.dynamicFilterValues = filters
      methods.getData()      
    },
    getData(){
      if(state.dynamicFilterValues?.deviceId) {
        state.loading = true
        methods.getSensors().then(response => {
          state.columns = methods.getColumns()        
          methods.getRecords().then(response => {
            state.marks = methods.setMarks(response)
            state.loading = false
          })
        })

      }
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
      return dynamicCols
    }, 
    getSensors(){
      return new Promise((resolve, reject) => {
        const params = {
          filter: {
            deviceId: state.dynamicFilterValues.deviceId
          }
        }
        services.getSensors(params).then(response => {
          state.sensors = response;
          resolve(response)
        })
      })
    }, 
    
    getRecords(){
      return new Promise((resolve, reject) => {
        const params = {
          filter: {...state.dynamicFilterValues}
        }        
        services.getRecords(params).then(response => {
          state.records = response;
          resolve(response)
        })
      })
    }, 
    setMarks(records){
      const marks = []
      
      const logs = []
      state.records.forEach((record) => {
        record.logs.forEach((log) => {
          const sensor = state.sensors.find(x => x.id == log.sensorId)
          logs.push({
            createdAt: record.createdAt,
            value: log.value,
            sensorId: log.sensorId,
            name: sensor.title || sensor.id
          })
        })
      })
      return [
        Plot.barY(logs, {x: 'name', y:  "value", tip: true, stroke: "green", fill: "green"})
      ]
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
