import { API_ROUTES, BASE_URL } from "@/constants/Config";
import { defineStore } from "pinia";
// Import axios to make HTTP requests
import axios from "axios";

export const dashboardStats = defineStore("dashboardStats", {
  state: () => ({
    statistics: [],
  }),
  getters: {
    getStatistics(state) {
      return state.statistics;
    },
  },
  actions: {
    async getStatisticsData(duration) {
      const res = await axios.post(
        `${BASE_URL}${API_ROUTES.DASHBOARD.STATISTICS}`, duration
      );
      this.statistics = res.data;

    },
  },
  persist: true,
});
