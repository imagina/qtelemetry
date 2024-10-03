<template>
</template>
<script>

export default {
  data() {
    return {
      crudId: this.$uid()
    }
  },
  computed: {
    crudData() {
      return {
        crudId: this.crudId,        
        apiRoute: 'apiRoutes.qtelemetry.records',
        create: {
          title: this.$tr('itelemetry.cms.newDevice'),
        },
        read: {
          columns: [],
          requestParams: {
            include: 'device,logs',
          },
          filters: {
            deviceId: {
              value: [],
              type: 'select',
              loadOptions: {
                apiRoute: 'apiRoutes.qtelemetry.devices',
                select: {label: 'title', id: 'id'},
              },
              props: {
                clearable: true,
                multiple: true,
                label: `${this.$tr('itelemetry.cms.form.devices')}`,
              }
            },
          },
        },
        create: false,
        update: false,
        delete: false
      }
    },
    //Crud info
    crudInfo() {
      return this.$store.state.qcrudComponent.component[this.crudId] || {}
    }
  },
}
</script>
