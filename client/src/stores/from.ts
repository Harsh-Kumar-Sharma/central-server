import { defineStore } from 'pinia';

export const usefromdataStore = defineStore({
  id: 'from',
  state: () => ({
    FormData: {}
  }),
  getters: {
    getIds: (state) => state.FormData,
  },
  actions: {
    setfromdata(fromdata) {
      this.FormData = fromdata;
    },

  }
});