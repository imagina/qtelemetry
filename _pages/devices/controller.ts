import {computed, reactive, ref, onMounted, toRefs, watch, getCurrentInstance} from "vue";
import { i18n } from 'src/plugins/utils';


export default function controller(props: any, emit: any) {

  // Refs
  const refs = {
    // refKey: ref(defaultValue)
  }

  // States
  const state = reactive({
    // Key: Default Value
    loading: false,
    map: null, 
    mapField: {
      value: [
        /* test */
        { lat: '-3.7327083213358336', lng: '-75.08056640625001' },
        {  lat: '19.973348786110613', lng: '-3.5156250000000004' }
      ],
      type: 'positionMarkerMap',
      help: { description: i18n.tr('icommerce.cms.form.mapHelp') },      
      props: {
        label: `${i18n.tr('isite.cms.label.search')}...`,
        readOnly: true, 
        markers: true
      }
    }
  })

  // Computed
  const computeds = {
    // key: computed(() => {})
  }

  // Methods
  const methods = {
    // methodKey: () => {}
    init(){
     
    },    
  }

  // Mounted
  onMounted(() => {
    methods.init()
  })

  // Watch
  // watch(key, (newField, oldField): void => {
  //
  // }, {deep: true})

  return {...refs, ...(toRefs(state)), ...computeds, ...methods}
}
