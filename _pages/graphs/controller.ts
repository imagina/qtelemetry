import {computed, reactive, ref, onMounted, toRefs, watch, getCurrentInstance} from "vue";
import services from 'modules/qtelemetry/_pages/graphs/services'
import { store, i18n, clone, alert } from 'src/plugins/utils';
import moment from "moment";

export default function controller(props: any, emit: any) {
  const proxy = getCurrentInstance()!.appContext.config.globalProperties

  const dateFormat = 'YYYY-MM-DD'

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
    logs: null,


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
    },
    averages: null,
    history: {      
      maxWidth: '900',
      height: '600',
      style: "overflow: visible;",
      x: {
        //grid: true,
        label: 'Date',
      },
      y: {
        grid: true,
        label: "Valor"
      },
      color: { legend: true },
      marks: []
    }
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
            state.logs = methods.mapLogs(response)            
            methods.updateMakrs()
            state.loading = false
          })
        })
      }
    },
    getColumns() {
      const dynamicCols = state.sensors.map((sensor) => {
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
    mapLogs(records){
      const logs = []
      records.forEach((record) => {
        record.logs.forEach((log) => {
          const sensor = state.sensors.find(x => x.id == log.sensorId)
          logs.push({
            date:  new Date(record.createdAt),
            value: log.value,
            sensorId: log.sensorId,
            name: sensor.title || sensor.id
          })
        })
      })
      return logs
    },
    updateMakrs(){
      methods.drawAverages()
      state.history.marks = methods.plotHistory()
    },

    /* averages */
    getAverages(){
      if(!state.logs) return []
      const logs = state.logs
      const averages = []
      state.sensors.forEach((sensor) => {
        const data = logs.filter(log => log.sensorId == sensor.id) || null        
        if(data && data.length){
          const sum = data.reduce((accumulator, obj) => accumulator + obj.value, 0);
          const average = sum / data.length;
          averages.push({
            label: sensor.title || sensor.id,
            average: average, 
            length: data.length,
            sum, 
          })
        }
      })
      return averages
    },
    drawAverages(){
      const averages = methods.getAverages()
      console.log(averages)
      state.averages = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          axisTick: {
            alignWithLabel: true
          },
          data: averages.map(a => a.label)
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: averages.map(a => a.average.toFixed(2)),
            type: 'bar'
          }
        ]
      }
    }, 

    /* history */    
    plotHistory(){
      if(!state.logs) return []
      return [
        //Plot.ruleY([0]),
        //Plot.lineY(state.logs, {x: "date", y: "value", stroke: "name", tip: "y", marker: 'circle'}),
        ///Plot.crosshair(state.logs, {x: "date", y: "value"})
        //Plot.ruleX(state.logs, Plot.pointerX({x: "date", py: "value", stroke: "red"})),
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
