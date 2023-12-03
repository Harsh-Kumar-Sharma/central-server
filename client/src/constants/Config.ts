export const CLIENT_URL = import.meta.env.VITE_APP_CLIENT_URL;
export const BASE_URL = import.meta.env.VITE_APP_API_URL;

export const API_ROUTES = {
  AUTH: {
    LOGIN: "/auth/login",
  },
  COMMON: {
    GET_ALL_MASTERS: "/common/getAllMaster",
  },
  DASHBOARD: {
    STATISTICS: "/dashboard/getAllStatistics",
  },
};
