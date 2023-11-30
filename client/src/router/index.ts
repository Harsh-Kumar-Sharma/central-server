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
    children: [
      {
        path: "/dashboard",
        name: "dashboard",
        component: () => import("@/views/Dashboard.vue"),
        meta: {
          pageTitle: "Dashboard",
          moduleName: "Dashboard",
        },
      }
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