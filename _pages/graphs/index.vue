<template>
    <div> 
      <div>
        <dynamicFilter 
          systemName="telemetry.graphs"
          :filters="dynamicFilters"
          @update:modelValue="filters => updateDynamicFilterValues(filters)"
        />
        
      </div>
      <div>
        <PlotFigure
            :options="{
              nice: true,
              marks: marks
            }"
        />
      </div>
      <inner-loading :visible="loading" />
    </div>
</template>
<script lang="ts">
import {defineComponent}  from 'vue'
import controller from 'modules/qtelemetry/_pages/graphs/controller'
import dynamicFilter from 'modules/qsite/_components/master/dynamicFilter';
import * as Plot from "@observablehq/plot";
import PlotFigure from "src/plugins/plotRender.js";

export default defineComponent({  
  components: {
    PlotFigure, 
    dynamicFilter
  },
  setup(props, {emit}) {
   return controller(props, emit)
  } 
})
</script>
