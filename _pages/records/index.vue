<template>
    <div>
      <crud
        v-if="columns"
        :crud-data="import('modules/qtelemetry/_crud/records')"
        :custom-data="{read: {
          columns: columns
        }}"
      />
    </div>
</template>
<script>
import baseService from 'src/modules/qcrud/_services/baseService';

export default {
  data() {
    return {
      defaultCols: [
        {
          name: 'id', label: this.$tr('isite.cms.form.id'), field: 'id', style: 'width: 50px'
        },
        {
          name: 'device', label: this.$tr('itelemetry.cms.device'), field: 'device', align: 'rigth',
          format: val => val && val?.title ? val.title : '-'
        },
        {
          name: 'created_at', label: this.$tr('isite.cms.form.createdAt'), field: 'createdAt', align: 'left',
          format: val => val ? this.$trd(val) : '-',
        }
      ],
      columns: null, 
      sensors: null,
    }
  },
  mounted() {
    this.init()
  },
  computed: {}, 
  methods: {
    init(){      
      this.getSensors().then((response) => {
        this.columns = this.getColumns()
      })
    },
    getColumns() {
      const dynamicCols =   this.sensors.map((sensor) => {
        return {
          name: `sensor_${sensor.id}`,
          field: 'logs', 
          label: sensor.title,              
          format: (val) => {
            if(val){
              const log = val.find((x) => x.sensorId == sensor.id )
              if(log && log?.value) return log.value
            }
            return '-'                
          },
        }
      })
      return [...this.defaultCols, ...dynamicCols]
    }, 
    getSensors(){
      return new Promise((resolve, reject) => {
        baseService.index('apiRoutes.qtelemetry.sensors', {refresh: true}).then(response => {
          this.sensors = response.data
          resolve(response.data)
        }).catch(error => reject(error));
      })
    }
  }
}
</script>
