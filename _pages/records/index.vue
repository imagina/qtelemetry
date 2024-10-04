<template>
    <div>
      <crud
        v-if="columns"
        :crud-data="import('modules/qtelemetry/_crud/records')"
        :custom-data="{read: {
          columns: columns
        }}"
      />
    <!--inner loading-->
    <inner-loading :visible="!columns" />
    </div>
</template>
<script lang="ts">
import {defineComponent}  from 'vue'
import controller from 'modules/qtelemetry/_pages/records/controller'

export default defineComponent({
  setup(props, {emit}) {
    return controller(props, emit)
  }
})
</script>
