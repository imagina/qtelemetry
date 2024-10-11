<template>
    <div>
      <!--filters -->
      <div class="row q-pa-md">
        <div class="col-12">
          <dynamicFilter 
            systemName="telemetry.graphs"
            :filters="dynamicFilters"
            :showOnMobile="true"
            @update:modelValue="filters => updateDynamicFilterValues(filters)"
          />        
        </div>        
      </div>      
      <not-result
        class="row q-pa-md q-my-md justify-center"  
        :label="this.$tr('itelemetry.cms.form.selectDevice')"
        v-if="!isDeviceSelected"        
      />
      <not-result class="row q-pa-md q-my-md justify-center" v-if="notResult" />
      
      <div v-if="isDeviceSelected">      
        <!--history-->      
        <div class="row q-pa-md q-my-md justify-center" v-if="showHistory">
          <v-chart
            class="chistoric-chart" 
            :option="history" 
            autoresize 
          />
        </div>
        <!--averages-->      
        <div class="row q-pa-md q-my-md justify-center" v-if="showAverages">
          <v-chart
            class="average-chart" 
            :option="averages" 
            autoresize 
          />
        </div>
        <div class="row q-pa-md justify-center" v-if="showAverages">
          <span class="tw-text-lg tw-font-bold">
            {{ averagesTitleByRange }}
          </span>
        </div>
        <div class="row q-col-gutter-md q-pa-md" v-if="showAverages">
          <div class="col-12 col-md-3" v-for="(item, index) in getAverages()">          
            <div class="average-card q-pa-md">
              <div class="tw-text-gray-400 tw-text-xs tw-font-semibold">{{ item.label }}</div>
              <span class="tw-text-lg tw-font-bold">
                {{ item.average.toFixed(4) }}
              </span>                          
            </div>
          </div>
        </div>      
      </div>
      <div class="row">
        <inner-loading :visible="loading" />
      </div>
    </div>
</template>
<script lang="ts">
import {defineComponent}  from 'vue'
import controller from 'modules/qtelemetry/_pages/graphs/controller'
import dynamicFilter from 'modules/qsite/_components/master/dynamicFilter';

/* vue echart imports */
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { PieChart, GraphChart, MapChart, BarChart, LineChart   } from 'echarts/charts'
import VChart from 'vue-echarts'

import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  ToolboxComponent,
  DataZoomComponent
} from 'echarts/components'

use([
  CanvasRenderer,
  PieChart,
  GraphChart,
  MapChart,
  BarChart,
  LineChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  ToolboxComponent ,
  DataZoomComponent
])
/* vue echart imports */

export default defineComponent({  
  components: {
    dynamicFilter,
    VChart
  },
  setup(props, {emit}) {
   return controller(props, emit)
  } 
})
</script>
<style lang="scss">
.average-card {
  background-color: #EBF1FA;
  border: solid 1px #dbd7d7;
  border-radius: 0.75rem;
}

.chistoric-chart {
  width:  100%;
  height: 520px;
}

.average-chart {
  width:  100%;
  height: 420px;
}
</style>