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
        <PlotRender
          :options="history"
        />
      </div>
      <!--averages-->      
      <div class="row q-pa-md q-my-sm justify-center">
        <div class="text-h6">
          Averages Graph
        </div>
      </div>
      <div class="row q-pa-md q-my-md justify-center">        
          <PlotRender
            :options="averages"
          />
      </div>      
      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-3" v-for="(item, index) in getAverages()">          
          <div class="average-card q-pa-md">
            <div class="text-h6">{{ item.name }}</div>
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
import * as Plot from "@observablehq/plot";
import PlotRender from "src/plugins/plotRender.js";

export default defineComponent({  
  components: {
    PlotRender, 
    dynamicFilter
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
</style>