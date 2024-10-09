<template>
    <div>      
      <div class="row">
        <dynamic-field v-model="map" class="q-mb-md col-12" :field="mapField"/>
      </div>
     
    <!--inner loading-->
    <inner-loading :visible="loading" />
    </div>
</template>
<script lang="ts">
import {defineComponent}  from 'vue'
import controller from 'modules/qtelemetry/_pages/devices/controller'

export default defineComponent({
  setup(props, {emit}) {
    return controller(props, emit)
  }
})
</script>
