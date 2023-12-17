import { API_ROUTES, BASE_URL } from "@/constants/Config";
import { defineStore } from 'pinia';
import axios from "axios";
export const useTmsStore = defineStore({
  id: 'TMStransaction',
  state: () => ({
    Filtertransaction: {},
    FilterMasterData: {},
    payload: {},
    payloadMaster: {}
  }),
  getters: {
    getFiltertransaction(state) {
      return state.Filtertransaction;
    },
    getpayload(state) {
      return state.payload
    },
    getFilterMasterData(state) {
      return state.FilterMasterData;
    },
    getpayloadMaster(state) {
      return state.payloadMaster
    }
  },
  actions: {
    async setFiltertransactionData(payload, page) {
      this.payload = payload
      const res = await axios.post(
        `${BASE_URL}${API_ROUTES.TMS_REPORT.FILTER_REPORT}/${page}`,
        payload
      );
      this.Filtertransaction = res.data;
    },
    async setFilterMasterData(payloadMaster, page) {
      this.payloadMaster = payloadMaster
      const res = await axios.post(
        `${BASE_URL}${API_ROUTES.TMS_REPORT.GET_FILTER_MASTER_DATA}/${page}`,
        payloadMaster
      );
      this.FilterMasterData = res.data;
    },
  }
});