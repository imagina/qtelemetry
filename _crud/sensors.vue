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
        apiRoute: 'apiRoutes.qtelemetry.sensors',
        permission: 'itelemetry.sensors',
        create: {
          title: this.$tr('itelemetry.cms.newSensor'),
        },
        read: {
          columns: [
            {
              name: 'id', label: this.$tr('isite.cms.form.id'), field: 'id', style: 'width: 50px'
            },
            {
              name: 'title', label: this.$tr('isite.cms.form.title'), field: 'title', align: 'rigth'},                          
            {
              name: 'systemName', label: this.$tr('isite.cms.form.systemName'), field: 'systemName', align: 'rigth',
            },
            {
              name: 'created_at', label: this.$tr('isite.cms.form.createdAt'), field: 'createdAt', align: 'left',
              format: val => val ? this.$trd(val) : '-',
            },
            {
              name: 'updated_at', label: this.$tr('isite.cms.form.updatedAt'), field: 'updatedAt', align: 'left',
              format: val => val ? this.$trd(val) : '-',
            },
            {
              name: 'actions', label: this.$tr('isite.cms.form.actions'), align: 'left'
            },
          ],
          filters: {}
        },
        update: {
          title: this.$tr('itelemetry.cms.updateSensor'),
        },
        delete: true,
        formLeft: {
          title: {
            value: '',
            type: 'input',
            isTranslatable: true,
            props: {
              label: `${this.$tr('isite.cms.form.title')}*`,
              rules: [
                val => !!val || this.$tr('isite.cms.message.fieldRequired')
              ],
            },
          },
          systemName: {
            value: '',
            type: 'input',
            props: {
              label: `${this.$tr('isite.cms.form.systemName')}*`,
              rules: [
                  val => !!val || this.$tr('isite.cms.message.fieldRequired')
              ],        
            }
          },          
          rules: {
            value: {},
            type: 'json',
            props: {
              label: this.$tr('itelemetry.cms.form.rules')
            }
          },
        },
        formRight: {
          prefix: {
            value: '',
            type: 'input',
            isFakeField: true,
            props: {
              label: this.$tr('isite.cms.form.prefix')
            }
          },
          suffix: {
            value: '',
            type: 'input',
            isFakeField: true,
            props: {
              label: this.$tr('isite.cms.form.suffix')
            }
          },
        }
      }
    },
    //Crud info
    crudInfo() {
      return this.$store.state.qcrudComponent.component[this.crudId] || {}
    }
  },
}
</script>
