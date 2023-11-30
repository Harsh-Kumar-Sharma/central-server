import { API_ROUTES, BASE_URL } from "@/constants/Config";
import { defineStore } from "pinia";
// Import axios to make HTTP requests
import axios from "axios";

export const useMasterData = defineStore("masterData", {
  state: () => ({
    masterData: <any>[],
  }),
  getters: {
    getMasters(state) {
      return state.masterData;
    },
  },
  actions: {
    async getMasterData() {
      const res = await axios.get(
        `${BASE_URL}${API_ROUTES.COMMON.GET_ALL_MASTERS}`
      );
      this.masterData = res.data.data;
    },
  },
  persist: true,
});
