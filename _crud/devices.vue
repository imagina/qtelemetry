<template>
</template>
<script>

export default {
  data() {
    return {
      crudId: this.$uid()
    };
  },
  computed: {
    crudData() {
      return {
        crudId: this.crudId,
        apiRoute: 'apiRoutes.qtelemetry.devices',
        create: {
          title: this.$tr('itelemetry.cms.newDevice')
        },
        read: {
          columns: [
            {
              name: 'id', label: this.$tr('isite.cms.form.id'), field: 'id', style: 'width: 50px'
            },
            {
              name: 'title', label: this.$tr('isite.cms.form.title'), field: 'title', align: 'rigth'
            },
            {
              name: 'country', label: this.$tr('isite.cms.label.country'), field: 'country', align: 'rigth',
              format: val => val && val?.name ? val.name : '-'
            },
            {
              name: 'province', label: this.$tr('isite.cms.label.department'), field: 'province', align: 'rigth',
              format: val => val && val?.name ? val.name : '-'
            },
            {
              name: 'city', label: this.$tr('isite.cms.form.city'), field: 'city', align: 'rigth',
              format: val => val && val?.name ? val.name : '-'
            },
            {
              name: 'created_at', label: this.$tr('isite.cms.form.createdAt'), field: 'createdAt', align: 'left',
              format: val => val ? this.$trd(val) : '-'
            },
            {
              name: 'updated_at', label: this.$tr('isite.cms.form.updatedAt'), field: 'updatedAt', align: 'left',
              format: val => val ? this.$trd(val) : '-'
            },
            {
              name: 'actions', label: this.$tr('isite.cms.form.actions'), align: 'left'
            }
          ],
          requestParams: {
            include: 'city,country,province,sensors'
          },
          filters: {
            countryId: {
              value: null,
              type: 'select',
              props: {
                label: this.$tr('ilocations.cms.form.country'),
                clearable: true
              },
              loadOptions: {
                apiRoute: 'apiRoutes.qlocations.countries',
                select: { label: 'name', id: 'id' }
              }
            },
            provinceId: {
              value: null,
              type: 'select',
              props: {
                label: this.$tr('ilocations.cms.form.province'),
                clearable: true
              },
              loadOptions: {
                apiRoute: 'apiRoutes.qlocations.provinces',
                select: { label: 'name', id: 'id' }
              }
            },
            cityId: {
              value: null,
              type: 'select',
              props: {
                label: this.$tr('isite.cms.form.city'),
                clearable: true
              },
              loadOptions: {
                apiRoute: 'apiRoutes.qlocations.cities',
                select: { label: 'name', id: 'id' }
              }
            }
          }
        },
        update: {
          title: this.$tr('itelemetry.cms.updateDevice'),
          requestParams: {
            include: 'sensors'
          },
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
              ]
            }
          },
          map: {
            value: null,
            type: 'positionMarkerMap',
            help: { description: this.$tr('icommerce.cms.form.mapHelp') },
            required: true,
            isFakeField: true,
            props: {
              label: `${this.$tr('isite.cms.label.search')}...`,
              emitDefault: (this.crudInfo.typeForm === 'create')
            }
          }
        },
        formRight: {
          countryId: {
            value: null,
            type: 'select',
            props: {
              label: this.$tr('isite.cms.label.country')
            },
            loadOptions: {
              apiRoute: 'apiRoutes.qlocations.countries',
              select: { label: 'name', id: 'id' }
            }
          },
          provinceId: {
            value: null,
            type: 'select',
            props: {
              label: this.$tr('isite.cms.label.department'),
              readonly: (this.crudInfo.countryId ? false : true)
            },
            loadOptions: {
              apiRoute: this.crudInfo.countryId ? 'apiRoutes.qlocations.provinces' : false,
              select: { label: 'name', id: 'id' },
              requestParams: { filter: { country: this.crudInfo.countryId } }
            }
          },
          cityId: {
            value: null,
            type: 'select',
            props: {
              label: this.$tr('isite.cms.form.city'),
              readonly: (this.crudInfo.provinceId ? false : true)
            },
            loadOptions: {
              apiRoute: this.crudInfo.provinceId ? 'apiRoutes.qlocations.cities' : false,
              select: { label: 'name', id: 'id' },
              requestParams: { filter: { province_id: this.crudInfo.provinceId } }
            }
          }, 
          sensors: {
            value: [],
            type: 'select',
            props: {
              label: this.$tr('sensors'),
              clearable: true,
              multiple: true,
            },
            loadOptions: {
              apiRoute: 'apiRoutes.qtelemetry.sensors',
              select: { label: 'title', id: 'id' }
            }
          },
          openPopup: {
            value: '1',
            isFakeField: true,
            type: 'toggle',
            props: {label: this.$tr('itelemetry.cms.form.openPopup')}
          },
        },
        getDataForm(data, type) {
          return new Promise(resolve => {
            //replace name value
            if (data.options) {
              data.lat = data.options.map?.lat;
              data.lng = data.options.map?.lng;
              data.openPopup = data.options.openPopup;
            }
            //Response
            resolve(data);
          });
        }
      };
    },
    //Crud info
    crudInfo() {
      return this.$store.state.qcrudComponent.component[this.crudId] || {};
    }
  }
};
</script>
