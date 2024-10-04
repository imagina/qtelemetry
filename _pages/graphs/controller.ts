import {computed, reactive, ref, onMounted, toRefs, watch, getCurrentInstance} from "vue";
import services from 'modules/qtelemetry/_pages/graphs/services'
import { store, i18n, clone, alert } from 'src/plugins/utils';
import * as Plot from "@observablehq/plot";

export default function controller(props: any, emit: any) {
  const proxy = getCurrentInstance()!.appContext.config.globalProperties

  // Refs
  const refs = {
    // refKey: ref(defaultValue)
  }

  // States
  const state = reactive({
    // Key: Default Value
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

      console.log(filters)
      state.dynamicFilterValues = filters
      methods.getData()      
    },
    getData(){
      if(state.dynamicFilterValues?.deviceId) {
        methods.getSensors().then(response => {
          state.columns = methods.getColumns()        
          methods.getRecords().then(response => {
            //map recrods
            console.warn('records', response)
            state.marks = methods.setMarks(response)
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
        console.log(params)
        services.getRecords(params).then(response => {
          state.records = response;
          resolve(response)
        })
      })
    }, 
    setMarks(records){
      console.warn('marks', records)

      return [
        Plot.lineY(records[0].logs, {x: "createdAt", y:  "value", tip: true, stroke: "red"})
      ]

      
      //Plot.lineY(this.records[0].logs, {x: this.records[0].createdAt, y:  "value", tip: true, stroke: "red"}),
      //Plot.ruleX(this.logs, Plot.pointerX({x: "Date", py: "Close", stroke: "red"})),
      
      //Plot.dot(this.logs, Plot.pointerX({x: "Date", y: "Close", stroke: "red"})),
      //Plot.text(this.logs, Plot.pointerX({px: "Date", py: "Close", dy: -17, frameAnchor: "top-left", fontVariant: "tabular-nums", text: (d) => [`Date ${Plot.formatIsoDate(d.Date)}`, `Close ${d.Close.toFixed(2)}`].join("   ")}))

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
