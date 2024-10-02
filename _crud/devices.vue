<template></template>
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
        apiRoute: 'apiRoutes.qtelemetry.devices',
        create: {
          title: this.$tr('itask.cms.newPriority'),
        },
        read: {
          columns: [
            {name: 'id', label: this.$tr('isite.cms.form.id'), field: 'id', style: 'width: 50px'},
            {name: 'title', label: this.$tr('isite.cms.form.title'), field: 'title', align: 'rigth'},            
            {name: 'lat', label: 'latitude', field: 'lat', align: 'rigth'},
            {name: 'lng', label: 'longitude', field: 'lng', align: 'rigth'},            
            {name: 'country', label: 'country', field: 'country', align: 'rigth', format: val => val && val?.name ? val.name : '-' },
            {name: 'province', label: 'province', field: 'province', align: 'rigth', format: val => val && val?.name ? val.name : '-' },
            {name: 'city', label: 'city', field: 'city', align: 'rigth', format: val => val && val?.name ? val.name : '-' },
            {
              name: 'created_at', label: this.$tr('isite.cms.form.createdAt'), field: 'createdAt', align: 'left',
              format: val => val ? this.$trd(val) : '-',
            },
            {
              name: 'updated_at', label: this.$tr('isite.cms.form.updatedAt'), field: 'updatedAt', align: 'left',
              format: val => val ? this.$trd(val) : '-',
            },
            {
              name: 'deleted_at', label: this.$tr('itask.cms.form.deletedAt'), field: 'deletedAt', align: 'left',
              format: val => val ? this.$trd(val) : '-',
            },
            {name: 'actions', label: this.$tr('isite.cms.form.actions'), align: 'left'},
          ],
          requestParams: {
            include: 'city,country,province',
          },          
          filters: {}
        },
        update: {
          title: this.$tr('itask.cms.updatePriority'),
        },
        //delete: true,
        formLeft: {},
        formRight: {}
      }
    },
    //Crud info
    crudInfo() {
      return this.$store.state.qcrudComponent.component[this.crudId] || {}
    }
  },
}
</script>
