<template>
  <div class="app-sidebar-menu overflow-hidden flex-column-fluid">
    <div id="kt_app_sidebar_menu_wrapper" class="app-sidebar-wrapper hover-scroll-overlay-y my-5" data-kt-scroll="true"
      data-kt-scroll-activate="true" data-kt-scroll-height="auto"
      data-kt-scroll-dependencies="#kt_app_sidebar_logo, #kt_app_sidebar_footer"
      data-kt-scroll-wrappers="#kt_app_sidebar_menu" data-kt-scroll-offset="5px" data-kt-scroll-save-state="true">
      <div id="#kt_app_sidebar_menu" class="menu menu-column menu-rounded menu-sub-indention px-3" data-kt-menu="true">
        <template v-for="(item, i) in availableMenu" :key="i">
          <div v-if="item.heading" class="menu-item pt-5">
            <div class="menu-content">
              <span class="menu-heading fw-bold text-uppercase fs-7">
                {{ translate(item.heading) }}
              </span>
            </div>
          </div>
          <template v-for="(menuItem, j) in item.pages" :key="j">
            <template v-if="menuItem.heading && !menuItem.sub">
              <div class="menu-item">
                <router-link v-if="menuItem.route" class="menu-link" active-class="active" :to="menuItem.route">
                  <span class="menu-icon">
                    <i :class="menuItem.bootstrapIcon" class="bi fs-3"></i>
                  </span>
                  <span class="menu-title">{{
                    translate(menuItem.heading)
                  }}</span>
                </router-link>
              </div>
            </template>
            <div v-if="menuItem.heading && menuItem.route && menuItem.sub"
              :class="{ show: hasActiveChildren(menuItem.route) }" class="menu-item menu-accordion"
              data-kt-menu-sub="accordion" data-kt-menu-trigger="click">
              <span class="menu-link">
                <span class="menu-icon">
                  <i :class="menuItem.bootstrapIcon" class="bi fs-3"></i>
                </span>
                <span class="menu-title">{{
                  translate(menuItem.heading)
                }}</span>
                <span class="menu-arrow"></span>
              </span>
              <div :class="{ show: hasActiveChildren(menuItem.route) }" class="menu-sub menu-sub-accordion">
                <template v-for="(item2, k) in menuItem.sub" :key="k">
                  <div v-if="item2.heading" class="menu-item">
                    <router-link v-if="item2.route" class="menu-link" active-class="active" :to="item2.route">
                      <span class="menu-bullet">
                        <span class="bullet bullet-dot"></span>
                      </span>
                      <span class="menu-title">{{
                        translate(item2.heading)
                      }}</span>
                    </router-link>
                  </div>
                </template>
              </div>
            </div>
          </template>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import MainMenuConfig from "@/core/config/MainMenuConfig.js";
import { sidebarMenuIcons } from "@/core/helpers/config";
import { useI18n } from "vue-i18n";
import { useAuthStore } from "@/stores/auth";
import { useMasterData } from "@/stores/common";

export default defineComponent({
  name: "sidebar-menu",
  components: {},
  data() {
    return {
      authStore: useAuthStore() as any,
      masters: useMasterData() as any,
    };
  },
  computed: {
    currentUser(): any {
      return this.authStore.user.info;
    },
    userModules(): any {
      return this.currentUser.permissions.modules;
    },
    modules() {
      return this.masters.getMasters.moduleMaster;
    },
    availableMenu(): any {
      const filterUserMenu = this.modules
        ? this.modules.filter((m) =>
          this.userModules.find((um) => um.module_id === m.id)
        )
        : [];
      const filteredMenu = this.MainMenuConfig[0]?.pages?.filter((p) =>
        filterUserMenu.find((m) => m.module_name === p.heading)
      );
      return [{ ...this.MainMenuConfig, pages: filteredMenu }];
    },
  },
  setup() {
    const { t, te } = useI18n();
    const route = useRoute();
    const scrollElRef = ref<null | HTMLElement>(null);

    onMounted(() => {
      if (scrollElRef.value) {
        scrollElRef.value.scrollTop = 0;
      }
    });

    const translate = (text: string) => {
      if (te(text)) {
        return t(text);
      } else {
        return text;
      }
    };

    const hasActiveChildren = (match: string) => {
      return route.path.indexOf(match) !== -1;
    };

    return {
      hasActiveChildren,
      MainMenuConfig,
      sidebarMenuIcons,
      translate,
    };
  },
});
</script>
