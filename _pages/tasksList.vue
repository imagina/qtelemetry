<template>
  <div>
    <!--Content-->
    <!-- tabs -->
    <div class="row">
      <div class="col-xs-12 col-sm-12 col-md-6 q-mb-sm" v-show="false">
        <q-tabs
          v-model="tabModel"
          dense
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
          align="left"
          no-caps
          narrow-indicator
          style="align-items: center;"
        >
          <q-tab v-for="(tab, index) in tabs" :key="index" :name="tab.value" :label="tab.label" />
        </q-tabs>
      </div>
    </div>
    <!-- tasks -->
    <div class="q-px-md">
      <dynamicList
        v-if="tabModel == tabs[0].value"
        ref="dynamicList"
        :listConfig="listConfig"
        @new="() => $refs.crudComponent.create()"
      >
        <!-- date range and week navigation -->
        <template #top-table>
          <div class="tw-w-full row q-my-md items-center justify-end">
            <q-btn
              text-color="primary" style="border: 1px solid rgba(0, 13, 71, 0.15)"
              class="q-mr-sm btn-small" icon="fa-regular fa-chevron-left"
              dense rounded unelevated @click="goToPrevious()" padding="8px"
            >
              <q-tooltip anchor="bottom middle" self="top middle">
                {{ $tr('itask.cms.previousWeek') }}
              </q-tooltip>
            </q-btn>
            <div class="row justify-center q-mx-sm">
              <div class="cursor-pointer row items-center">
                <q-icon name="fal fa-calendar-range" color="amber"
                        class="q-mr-sm" size="23px" />
                <div class="text-blue-grey" style="line-height: 1">
                  <div class="text-caption" style="line-height: 1">
                    {{ $tr('isite.cms.label.date') }}
                  </div>
                  {{ dynamicListTitle }}
                </div>
              </div>
              <q-tooltip>{{$tr('isite.cms.label.edit')}}</q-tooltip>
              <q-popup-edit
                ref="titleModal"
                v-model="dateRangeFilter.value"
                transition-show="fade-in"
                transition-hide="fade-out"
                :cover="false"
                anchor="bottom start"
              >
                <div style="width: 240px;">
                  <dynamic-field
                    v-model="dateRangeFilter.value"
                    @update:model-value="(value) => setDateRange(value)"
                    :field="dateRangeFilter"
                  />
                </div>
              </q-popup-edit>
            </div>
            <q-btn
              text-color="primary" style="border: 1px solid rgba(0, 13, 71, 0.15)"
              class="q-ml-sm btn-small" icon="fa-regular fa-chevron-right"
              dense rounded unelevated @click="goToPrevious()" padding="8px"
            >
              <q-tooltip anchor="bottom middle" self="top middle">
                {{ $tr('itask.cms.nextWeek') }}
              </q-tooltip>
            </q-btn>
          </div>
        </template>
      </dynamicList>
    </div>

    <!--- show task modal --->
    <master-modal
      v-model="selectedRow.showModal"
      :title="`Task : ${selectedRow.row?.id}`"
      custom-position
      @hide="selectedRow.showModal = false"
    >
      <taskComponent
        :row="selectedRow.row"
        @onClose="selectedRow.showModal = false"
        @onUpdate="(row) => onUpdate(row)"
        @onDelete="(row) => onDelete(row)"
        @openTimeLogsModal="(row) => openTimeLogsModal(row)"
      />
    </master-modal>

    <!-- crud form -->
    <crud
      ref="crudComponent"
      :type="null"
      :crud-data="import('modules/qtask/_crud/tasks')"
      @created="refreshDynamicList()"
      @updated="refreshDynamicList()"
      @deleted="refreshDynamicList()"
    />

    <!-- modal for timelogs -->
    <master-modal
      v-model="selectedRow.timeLogsModal"
      :title="$tr('itask.cms.timeLogs.title')"
      width="460px"
      @hide="selectedRow.timeLogsModal = false"
    >
      <timeLogsComponent
        :row="selectedRow.row"
        @closeModal="selectedRow.timeLogsModal = false"
        @reloadRow="(row) => reloadRow(row)"
      />
    </master-modal>

    <inner-loading :visible="loading" />
  </div>
</template>
<script>
//Components
import dynamicList from 'modules/qsite/_components/master/dynamicList';
import timeLogsComponent from 'modules/qtask/_components/timeLogs';
import taskComponent from 'modules/qtask/_components/task';
import moment from 'moment';
const dateFormat = 'YYYY/MM/DD';

export default {
  props: {},
  components: {
    dynamicList,
    timeLogsComponent,
    taskComponent
  },
  watch: {},
  mounted() {
    this.$nextTick(function() {
      //this.init()
    });
  },
  data() {
    return {
      selectedRow: {
        timeLogsModal: false,
        showModal: false,
        row: null
      },

      tabs: [
        {
          value: 'table',
          label: 'Table'
        },
        {
          value: 'backlog',
          label: 'Backlog'
        }
      ],
      tabModel: 'table',
      date: {
        from: moment().startOf('week').format(dateFormat),
        to: moment().endOf('week').format(dateFormat),
        title: this.$tr('itask.cms.week')
      },
      dateRangeFilter: {
        value: {
          type: 'customRange',
          from: moment().startOf('week').format(dateFormat),
          to: moment().endOf('week').format(dateFormat)
        },
        type: 'dateRange',
        props: {
          label: 'Date',
          clearable: false,
          removeTime: true,
          autoClose: true
        }
      },
      loading: false,
      listConfig: {
        apiRoute: 'apiRoutes.qtask.tasks',
        permission: 'itask.tasks',
        pageActions: {
          extraActions: ['search', 'new']
        },
        read: {
          title: this.$tr('itask.cms.taskManagement'),
          tableProps: {
            dense: true
          },
          columns: [
            {
              name: 'id', label: this.$tr('isite.cms.form.id'), field: 'id', style: '',
              onClick: (val, row) => this.openShowModal(row)
            },
            {
              name: 'title', label: this.$tr('isite.cms.form.title'), field: 'title',
              align: 'rigth', style: 'max-width: 250px',
              onClick: (val, row) => this.openShowModal(row)
            },
            {
              name: 'category', label: this.$tr('isite.cms.form.category'),
              align: 'left', field: 'category', style: 'max-width : 250px',
              format: (val) => val && val?.title ? val.title : '-',
              dynamicField: {
                value: null,
                type: 'select',
                name: 'categoryId',
                props: {
                  label: this.$tr('isite.cms.form.category'),
                  useInput: true,
                  rules: [
                    val => !!val?.length || this.$tr('isite.cms.message.fieldRequired')
                  ]
                },
                loadOptions: {
                  apiRoute: 'apiRoutes.qtask.categories',
                  select: {
                    label: 'title',
                    id: item => `${item.id}`
                  }
                }
              }
            },
            {
              name: 'assignedTo', label: this.$tr('itask.cms.form.assigned'), field: 'assignedTo', align: 'left',
              format: (val) => ((val && (val.firstName || val.lastName)) ? `${val.firstName} ${val.lastName}` : '-'),
              dynamicField: {
                value: [],
                type: 'select',
                name: 'assignedToId',
                props: {
                  label: this.$tr('itask.cms.form.assigned'),
                  useInput: true,
                  clearable: true,
                  rules: [
                    val => !!val?.length || this.$tr('isite.cms.message.fieldRequired')
                  ]
                },
                loadOptions: {
                  apiRoute: 'apiRoutes.quser.users',
                  select: {
                    label: 'email',
                    id: item => `${item.id}`
                  }
                }
              }
            },
            {
              name: 'startDate', label: this.$tr('isite.cms.form.startDate'), field: 'startDate', align: 'center',
              style: 'padding: 0 5px',
              contentType: (row) => {
                return {
                  template: 'date',
                  props: {
                    date: row.startDate,
                    expirationDate: moment(),
                  }
                }
              },
              dynamicField: {
                value: '',
                type: 'date',
                props: {
                  label: this.$tr('isite.cms.form.startDate')
                }
              }
            },
            {
              name: 'endDate', label: this.$tr('isite.cms.form.endDate'), field: 'endDate', align: 'center',
              style: 'padding: 0 5px',
              contentType: (row) => {
                return {
                  template: 'date',
                  props: {
                    date: row.endDate,
                    expirationDate: moment(),
                  }
                }
              },
              dynamicField: {
                value: '',
                type: 'date',
                props: {
                  label: this.$tr('isite.cms.form.endDate')
                }
              }
            },
            {
              name: 'duration', label: this.$tr('itask.cms.duration'), field: 'duration', align: 'left',
              format: (val) => val ? val : '-'
            },
            {
              name: 'status', label: this.$tr('isite.cms.form.status'), field: 'status', align: 'center',
              style: 'padding: 0 0 0 5px',
              //classes: 'padding-none',
              //headerClasess: 'padding-none',
              contentType: (row) => {
                return {
                  template: 'colorCell',
                  props: {
                    label: row.status.title,
                    color: row.status.color,
                    icon: row.status.icon
                  }
                }
              },
              dynamicField: {
                type: 'select',
                name: 'statusId',
                props: {
                  label: this.$tr('isite.cms.form.status'),
                  useInput: true,
                  clearable: true,
                  rules: [
                    val => !!val?.length || this.$tr('isite.cms.message.fieldRequired')
                  ]
                },
                loadOptions: {
                  apiRoute: 'apiRoutes.qtask.statuses',
                  select: {
                    label: 'title',
                    id: item => `${item.id}`
                  }
                }
              }
            },
            {
              name: 'priority', label: this.$tr('itask.cms.form.priority'), field: 'priority', align: 'center',
              style: 'padding: 0 5px 0 0',
              contentType: (row) => {
                return {
                  template: 'colorCell',
                  props: {
                    label: row.priority.title,
                    color: row.priority.color,
                    icon: row.priority.icon
                  }
                }
              },
              dynamicField: {
                value: [],
                type: 'select',
                name: 'priorityId',
                props: {
                  label: this.$tr('itask.cms.form.priority'),
                  useInput: true,
                  clearable: true,
                  rules: [
                    val => !!val?.length || this.$tr('isite.cms.message.fieldRequired')
                  ]
                },
                loadOptions: {
                  apiRoute: 'apiRoutes.qtask.priorities',
                  select: {
                    label: 'title',
                    id: item => `${item.id}`
                  }
                }
              }
            },
            {
              name: 'estimatedTime',
              label: this.$tr('itask.cms.form.estimatedTime'),
              field: 'formatedEstimatedTime',
              align: 'left',
              format: (val, row) => row?.formatedEstimatedTime ? row.formatedEstimatedTime : '-',
              dynamicField: {
                value: '',
                name: 'estimatedTime',
                type: 'timeSpent',
                props: {
                  label: this.$tr('itask.cms.form.estimatedTime'),
                  unit: 'minutes'
                }
              }
            },
            {
              name: 'totalFormatedTimelogsDuration',
              label: this.$tr('itask.cms.timeLogs.title'),
              field: 'totalFormatedTimelogsDuration',
              align: 'left',
              format: (val) => val ? val : '-',
              onClick: (val, row) => {
                this.openTimeLogsModal(row);
              }
            },
            {
              name: 'actions', label: this.$tr('isite.cms.form.actions'),
              align: 'center'
            }
          ],
          requestParams: {
            include: 'category,status,priority,timelogs.creator,assignedTo',
            filter: {
              rangeDate: {
                from: moment().startOf('week').format(dateFormat),
                to: moment().endOf('week').format(dateFormat)
              }
            }
          },
          filters: {
            assignedToId: {
              value: [],
              type: 'select',
              props: {
                label: this.$tr('itask.cms.form.assigned'),
                useInput: true,
                clearable: true,
                rules: [
                  val => !!val?.length || this.$tr('isite.cms.message.fieldRequired')
                ]
              },
              loadOptions: {
                apiRoute: 'apiRoutes.quser.users',
                select: {
                  label: 'email',
                  id: item => `${item.id}`
                },
                filterByQuery: true
              }
            },
            categoryId: {
              value: [],
              type: 'select',
              props: {
                label: this.$tr('isite.cms.form.category'),
                useInput: true,
                clearable: true,
                rules: [
                  val => !!val?.length || this.$tr('isite.cms.message.fieldRequired')
                ]
              },
              loadOptions: {
                apiRoute: 'apiRoutes.qtask.categories',
                filterByQuery: true,
                select: {
                  label: 'title',
                  id: item => `${item.id}`
                }
              }
            },
            priorityId: {
              value: [],
              type: 'select',
              props: {
                label: this.$tr('itask.cms.form.priority'),
                useInput: true,
                clearable: true,
                rules: [
                  val => !!val?.length || this.$tr('isite.cms.message.fieldRequired')
                ]
              },
              loadOptions: {
                apiRoute: 'apiRoutes.qtask.priorities',
                select: {
                  label: 'title',
                  id: item => `${item.id}`
                }
              }
            },
            statusId: {
              value: [],
              type: 'select',
              props: {
                label: this.$tr('isite.cms.form.status'),
                useInput: true,
                clearable: true,
                rules: [
                  val => !!val?.length || this.$tr('isite.cms.message.fieldRequired')
                ]
              },
              loadOptions: {
                apiRoute: 'apiRoutes.qtask.statuses',
                select: {
                  label: 'title',
                  id: item => `${item.id}`
                }
              }
            }
          },

          help: {
            title: this.$tr('itask.cms.taskManagement'),
            description: this.$tr('itask.cms.taskManagement')
          }

        },
        
        //runs before update the row
        beforeUpdate: ({ val, row }) => {
          return new Promise((resolve, reject) => {
            //check startDate should be minor than dateFormat
            if (row.description == '') reject();
            if (moment(row.startDate).format(dateFormat) > moment(row.endDate).format(dateFormat)) {
              this.$alert.error({ message: this.$tr('itask.cms.date.error') });
              reject();
            } else {
              resolve(val);
            }
          });
        },
        
        actions: [
          //onClick: ({row}) => this.openShowModal(row)
          {//Open timelogs
            icon: 'fa-light fa-timer',
            name: 'addTimelog',
            label: this.$tr('itask.cms.timeLogs.title'),
            action: (item) => {
              this.openTimeLogsModal(item);
            }
          },
          {//show action
            icon: 'fa-light fa-eye',
            name: 'edit',
            label: this.$tr('isite.cms.label.show'),
            action: (item) => {
              this.openShowModal(item);
            }
          },
          {//Edit action
            icon: 'fa-light fa-pencil',
            name: 'edit',
            label: this.$tr('isite.cms.label.edit'),
            action: (item) => {
              this.onUpdate(item);
            }
          },
          {//Delete action
            icon: 'fa-light fa-trash-can',
            name: 'delete',
            label: this.$tr('isite.cms.label.delete'),
            action: (item) => {
              this.onDelete(item);
            }
          }
        ]
      }
    };
  },
  computed: {
    dynamicListTitle() {
      const from = moment(new Date(this.date.from)).format('MMM Do');
      const to = moment(new Date(this.date.to)).format('MMM Do');
      return `${this.date.title}:  ${from} - ${to}`;
    }

  },
  methods: {
    init() {
    },
    setDate(from, to, title) {
      this.date = { from, to, title };
      this.dateRangeFilter.value = {
        type: 'customRange',
        from,
        to
      };
      this.listConfig.read.requestParams.filter['rangeDate'] = this.date;
      this.$refs.dynamicList.updateFilter('rangeDate', this.date);
      this.refreshDynamicList();
    },
    refreshDynamicList() {
      if (this.selectedRow.showModal || this.selectedRow.timeLogsModal) {
        this.selectedRow.timeLogsModal = false;
        this.selectedRow.showModal = false;
        this.selectedRow.row = null;
      }
      this.$refs.dynamicList.getData({ page: 1 }, true);
    },
    goToPrevious() {
      //next week
      const from = moment(new Date(this.date.from)).subtract(1, 'weeks').startOf('week').format(dateFormat);
      const to = moment(new Date(this.date.from)).subtract(1, 'weeks').endOf('week').format(dateFormat);
      const title = this.$tr('itask.cms.week');
      this.setDate(from, to, title);
    },
    goToNext() {
      //next week
      const from = moment(new Date(this.date.from)).add(1, 'weeks').startOf('week').format(dateFormat);
      const to = moment(new Date(this.date.to)).add(1, 'weeks').endOf('week').format(dateFormat);
      const title = this.$tr('itask.cms.week');
      this.setDate(from, to, title);
    },
    setDateRange(value) {
      if (value != null && value?.from && value?.to) {
        const from = moment(new Date(value.from)).format(dateFormat);
        const to = moment(new Date(value.to)).format(dateFormat);
        if (from != this.date.from || to != this.date.to) {
          this.setDate(from, to, value.label);
          this.$refs.titleModal.hide();
        }
      }
    },
    openTimeLogsModal(row) {
      this.selectedRow.row = row;
      this.selectedRow.timeLogsModal = true;
    },
    async reloadRow(row) {
      const newRow = await this.$refs.dynamicList.reloadRow(row);
      this.selectedRow.row = newRow;
    },
    openShowModal(row) {
      this.selectedRow.row = row;
      this.selectedRow.showModal = true;
    },
    onUpdate(row) {
      this.$refs.crudComponent.update(row);
    },
    onDelete(row) {
      this.$refs.crudComponent.delete(row);
    }
  }
};
</script>
<style lang="scss">
.padding-none {
  padding: 0px !important;
}
</style>
