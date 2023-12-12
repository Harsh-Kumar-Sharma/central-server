import { createRouter, createWebHashHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useConfigStore } from "@/stores/config";
import { useMasterData } from "@/stores/common";

const routes = [
  {
    path: "/",
    redirect: "/sign-in",
    component: () => import("@/layouts/AuthLayout.vue"),
    children: [
      {
        path: "/sign-in",
        name: "sign-in",
        component: () => import("@/views/Login.vue"),
        meta: {
          pageTitle: "Sign In",
          moduleName: "Sign In",
        },
      },
      {
        path: "/password-reset",
        name: "password-reset",
        component: () => import("@/views/PasswordReset.vue"),
        meta: {
          pageTitle: "Password reset",
          moduleName: "Password reset",
        },
      },
    ],
  },
  {
    path: "/dashboard",
    component: () => import("@/layouts/main-layout/MainLayout.vue"),
    meta: {
      middleware: "auth",
    },
    children: [
      {
        path: "/dashboard",
        name: "dashboard",
        component: () => import("@/views/Dashboard.vue"),
        meta: {
          pageTitle: "Dashboard",
          moduleName: "Dashboard",
        },
      },
      {
        path: "/reports",
        component: () => import("@/views/TmsReports.vue"),
        meta: {
          middleware: "auth",
          moduleName: "TMS Reports",
        },
        children: [
          {
            path: "/transaction-details-report",
            name: "transactionDetailsReport",
            component: () =>
              import("@/components/tms-report/transactionDetails.vue"),
            meta: {
              pageTitle: "Reports - Transaction Details Report",
              subModuleName: "Transaction Details Report",
            },
          },
          {
            path: "/transaction-summary-report",
            name: "VehicleSummaryReport",
            component: () =>
              import("@/components/tms-report/transactionSummary.vue"),
            meta: {
              pageTitle: "Reports - Transaction Summary Report",
              subModuleName: "Transaction Summary Report",
            },
          },
          {
            path: "/transaction-revenue-report",
            name: "VehicleRevenueReport",
            component: () =>
              import("@/components/tms-report/revenueSummary.vue"),
            meta: {
              pageTitle: "Reports - Transaction Revenue Report",
              subModuleName: "Transaction Revenue Report",
            },
          },
          {
            path: "/transaction-avc-report",
            name: "AvcRevenueReport",
            component: () =>
              import("@/components/tms-report/AvcFilter.vue"),
            meta: {
              pageTitle: "Reports - Transaction Avc Report",
              subModuleName: "Transaction Avc Report",
            },
          },
          {
            path: "/download-reports",
            name: "downloadReport",
            component: () =>
              import("@/components/tms-report/downloadReport.vue"),
            meta: {
              pageTitle: "Download-Reports",
              subModuleName: "Download Report",
            },
          },
        ],
      },
    ],
  },
  {
    path: "/system",
    component: () => import("@/layouts/SystemLayout.vue"),
    children: [
      {
        path: "/404",
        name: "404",
        component: () => import("@/views/Error404.vue"),
        meta: {
          pageTitle: "Error 404",
        },
      },
    ],
  },
  {
    path: "/analysis",
    component: () => import("@/layouts/main-layout/MainLayout.vue"),
    meta: {
      middleware: "auth",
      moduleName: "Analysis",
    },
    children: [
      {
        path: "/analysis",
        name: "Analysis",
        component: () => import("@/views/Analysis.vue"),
        meta: {
          pageTitle: "Analysis",
          moduleName: "Analysis",
        },
        children: [
          {
            path: "/server-transaction",
            name: "Server Transaction",
            component: () =>
              import("@/components/Analysis/serverTransaction.vue"),
            meta: {
              pageTitle: "Server Transaction",
              subModuleName: "Analysis",
            },
          },
          {
            path: "/lane-transaction",
            name: "Lane Transaction",
            component: () =>
              import("@/components/Analysis/laneTransaction.vue"),
            meta: {
              pageTitle: "Lane Transaction",
              subModuleName: "Analysis",
            },
          },
        ],
      },
    ],
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/404",
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});


router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  const configStore = useConfigStore();
  const masterStore = useMasterData() as any;

  // current page view title
  document.title = `${to.meta.pageTitle} - ${import.meta.env.VITE_APP_NAME}`;

  // reset config to initial state
  configStore.resetLayoutConfig();

  try {
    // verify auth token before each page change
    await authStore.verifyAuth();

    // before page access check if page requires authentication
    if (to.meta.middleware == "auth") {
      if (authStore.isAuthenticated) {
        if (masterStore.getMasters) {
          const allowedModules = masterStore.getMasters.moduleMaster
            .filter((m) =>
              authStore.user.info.permissions.modules.find(
                (um) => um.module_id === m.id
              )
            )
            .map((p) => p.module_name);

          if (
            allowedModules.indexOf(to.meta.moduleName) === -1 &&
            !to.meta.subModuleName
          ) {
            next({ name: "404" });
            return;
          }
        }

        next();
      } else {
        next({ name: "sign-in" });
      }
    } else {
      next();
    }
  } catch (e) {
    // console.error(e)
    next();
    // next({ name: "sign-in" });
  }

  // Scroll page to top on every route change
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "smooth",
  });
});


export default router;