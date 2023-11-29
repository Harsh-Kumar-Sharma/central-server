import { API_ROUTES, BASE_URL } from "@/constants/Config";
import { defineStore } from "pinia";
// Import axios to make HTTP requests
import axios from "axios";

export const dashboardStats = defineStore("dashboardStats", {
  state: () => ({
    statistics: [],
    CountTranscationData: {}
  }),
  getters: {
    getStatistics(state) {
      return state.statistics;
    },
    getCountTranscation(state) {
      return state.CountTranscationData
    }
  },
  actions: {
    async getStatisticsData() {
      const res = await axios.get(
        `${BASE_URL}${API_ROUTES.DASHBOARD.STATISTICS}`
      );
      this.statistics = res.data.data;
    },
    async getCountTranscationData(duration) {
      const res = await axios.get(
        `${BASE_URL}${API_ROUTES.DASHBOARD.COUNTTRANSCATION}/${duration}`
      );
      this.CountTranscationData = res.data;

    },
  },
  persist: true,
});
