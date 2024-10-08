<template>
    <div> 
      <!--filters -->
      <div class="row">
        <div class="col-12">
          <dynamicFilter 
          systemName="telemetry.graphs"
          :filters="dynamicFilters"
          @update:modelValue="filters => updateDynamicFilterValues(filters)"
        />        
        </div>
        
      </div>
      <!--history-->      
      <div class="row q-pa-md q-my-xs justify-center">
        <div class="text-h6">
          Historical Graph
        </div>
      </div>
      <div class="row q-pa-md q-my-md justify-center">
        <!--<PlotRender
          :options="history"
        />-->
      </div>
      <!--averages-->      
      <div class="row q-pa-md q-my-sm justify-center">
        <div class="text-h6">
          Averages Graph
        </div>
      </div>
      <div class="row q-pa-md q-my-md justify-center">        
          <!--<PlotRender
            :options="averages"
          />-->
          <v-chart 
            v-if="!loading"
            class="average-chart" 
            :option="averages" 
            autoresize 
          />

      </div>      
      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-3" v-for="(item, index) in getAverages()">          
          <div class="average-card q-pa-md">
            <div class="text-h6">{{ item.label }}</div>
            <span class="text-h6 text-weight-bolder">
              {{ item.average.toFixed(2) }}
            </span>                          
          </div>
        </div>
      </div>      
      <inner-loading :visible="loading" />
    </div>
</template>
<script lang="ts">
import {defineComponent}  from 'vue'
import controller from 'modules/qtelemetry/_pages/graphs/controller'
import dynamicFilter from 'modules/qsite/_components/master/dynamicFilter';

/* vue echart imports */
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { PieChart, GraphChart, MapChart, BarChart, LineChart } from 'echarts/charts'
import VChart, { THEME_KEY } from 'vue-echarts'

import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent 
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
  GridComponent 
])
/* vue echart imports */

export default defineComponent({  
  components: {
    //PlotRender, 
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
  background-color: #f1f1f1;
  border: solid 1px #dbd7d7;
  border-radius: 0.75rem;
}

.average-chart {
  width:  100%;
  height: 420px;
}
</style>