import Vue from 'vue'
import VPopover from 'vue-js-popover'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faPaperPlane,faCreditCard,faChartSimple,faBuildingColumns,faAngleLeft,faChevronRight} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import VueSplash from 'vue-splash';

library.add(faPaperPlane,faCreditCard,faChartSimple,faBuildingColumns,faAngleLeft,faChevronRight)
Vue.component('FaIcon', FontAwesomeIcon)
Vue.use(VPopover, { tooltip: true })
Vue.use(VueSplash);