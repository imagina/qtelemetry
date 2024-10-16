import {computed, reactive, ref, onMounted, toRefs, watch, getCurrentInstance} from "vue";
import services from 'modules/qtelemetry/_pages/graphs/services'
import { i18n } from 'src/plugins/utils';
import moment from "moment";

export default function controller(props: any, emit: any) {  

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
    records: [],
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
          label: `${i18n.tr('itelemetry.cms.form.devices')}*`,
          clearable: true,
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
          label: `${i18n.tr('isite.cms.form.date')}*`,
          clearable: true,
          removeTime: true,
          autoClose: true
        }
      },      
    },
    averages: null,
    history: null
  })

  // Computed
  const computeds = {
    // key: computed(() => {})
    isDeviceSelected: computed(() => state.dynamicFilterValues.deviceId),
    notResult: computed(() => !state.records.length && computeds.isDeviceSelected.value && !state.loading),
    showAverages: computed(() => !state.loading && state.averages && state.records.length),
    showHistory: computed(() => !state.loading && state.history && state.records.length), 
    averagesTitleByRange: computed(() => i18n.tr('itelemetry.cms.averagesByRange', {from: state.dynamicFilterValues.date.from, to: state.dynamicFilterValues.date.to}) )
  }

  // Methods
  const methods = {
    // methodKey: () => {}
    init(){},
    updateDynamicFilterValues(filters){
      state.dynamicFilterValues = filters
      if(computeds.isDeviceSelected.value){
        methods.getData()
      }
    },
    getData(){
      if(state.dynamicFilterValues?.deviceId && state.dynamicFilterValues?.date) {
        state.loading = true
        methods.getSensors().then(response => {
          state.columns = methods.getColumns()        
          methods.getRecords().then(response => {
            state.logs = methods.mapLogs(response)            
            methods.updateGraphs()
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
            date:  record.createdAt,
            value: log.value,
            sensorId: log.sensorId,
            name: sensor.title || sensor.id
          })
        })
      })
      return logs
    },
    updateGraphs(){
      methods.drawAverages()
      methods.drawHistory()
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
          
          const options = sensor?.options || {}
          const label = (options?.prefix && options?.suffix) ? `${options.prefix} ${options.suffix}` : sensor.title 
          averages.push({
            label,
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
      state.averages = {
        title: {
          text: i18n.tr('itelemetry.cms.averagesGraph'),
          left: 'center',
        },
        toolbox: {
          feature: {
            saveAsImage: {
              show: true,
              title: i18n.tr('itelemetry.cms.form.saveImage'),
              pixelRatio: 3
            }
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
         left: '4%',
         right: '4%',
         bottom: '4%',
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
            type: 'bar',
            label: {
              show: true,
              position: 'inside'
            },
            data: averages.map(a => a.average.toFixed(2))
          }
        ]
      }
    }, 

    /* history */    
    drawHistory(){
      if(!state.logs) return [];    

      let date = state.records.map(r => r.createdAt)      
      date = Array.from(new Set(date)) //remove duplicates
      let series = [];
      //adds a serie for each sensor
      state.sensors.forEach(s => {        
        series.push({
          name: s.title, 
          type: 'line',
          stack: 'Total',
          emphasis: {
            focus: 'series'
          },
          label: {
            show: true,
            position: 'top'
          },
          data: state.logs.filter(l => l.sensorId == s.id) //filters logs by sensor
        })
      })
      
      state.history = {
        tooltip: {
          trigger: 'axis',
          position: function (pt) {
            return [pt[0], '10%'];
          }
        },        
        title: {
          text: i18n.tr('itelemetry.cms.historicalGraph'),
          left: 'center',
        },
        
        legend: {
          type: 'scroll',
          top: '10%',
          data: state.sensors.map(s => s.title)
        },
        grid: {
          top: '30%',
          left: '4%',
          right: '4%',
          bottom: '4%',
          containLabel: true
         },
        toolbox: {
          feature: {
            restore: {},
            saveAsImage: {
              show: true,
              title: i18n.tr('itelemetry.cms.form.saveImage'),
              pixelRatio: 3
            }
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: date
        },
        yAxis: {
          type: 'value',
          boundaryGap: [0, '100%']
        },
        dataZoom: [
          {
            type: 'inside',
            //start: 0,
            //end: 10
          },
          {
            //start: 0,
            //end: 10
          }
        ],
        series: series
      };      
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
