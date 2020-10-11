import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({
   
    state: {
      API_KEY: 'tQ74lJrelqz0nm1moUAFjVfoh91pMLey'
    },
    getters: {
      getKey: state => {
        return state.API_KEY;
      }
    }
  
  })
  return Store
}