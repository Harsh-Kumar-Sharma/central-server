<template>
  <!--begin::Menu-->
  <div
    class="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-semobold py-4 fs-6 w-275px"
    data-kt-menu="true"
  >
    <!--begin::Menu item-->
    <div class="menu-item px-3">
      <div class="menu-content d-flex align-items-center px-3">
        <!--begin::Avatar-->
        <div class="symbol symbol-50px me-5">
          <img alt="Logo" :src="getAssetPath('assets/images/blank.jpeg')" />
        </div>
        <!--end::Avatar-->

        <!--begin::Username-->
        <div class="d-flex flex-column">
          <div class="fw-bold d-flex align-items-center fs-5">
            {{ user?.first_name }} {{ user?.last_name }}
          </div>
          <a
            href="javascript:void()"
            class="fw-semobold text-muted text-hover-primary fs-7"
            >{{ user?.role }}</a
          >
        </div>
        <!--end::Username-->
      </div>
    </div>
    <!--end::Menu item-->

    <!--begin::Menu separator-->
    <div class="separator my-2"></div>
    <!--end::Menu separator-->

    <!--begin::Menu item-->
    <div class="menu-item px-5 my-1">
      <router-link to="/account-settings" class="menu-link px-5">
        Account Settings
      </router-link>
    </div>
    <!--end::Menu item-->

    <!--begin::Menu item-->
    <div class="menu-item px-5">
      <a @click="signOut()" class="menu-link px-5"> Sign Out </a>
    </div>
    <!--end::Menu item-->
  </div>
  <!--end::Menu-->
</template>

<script lang="ts">
import { getAssetPath } from "@/core/helpers/assets";
import { computed, defineComponent } from "vue";
import { useI18n } from "vue-i18n";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "kt-user-menu",
  components: {},
  setup() {
    const router = useRouter();
    const i18n = useI18n();
    const store = useAuthStore();
    const user = store.user.info;

    i18n.locale.value = localStorage.getItem("lang")
      ? (localStorage.getItem("lang") as string)
      : "en";

    // const countries = {
    //   en: {
    //     flag: getAssetPath("media/flags/united-states.svg"),
    //     name: "English",
    //   },
    //   es: {
    //     flag: getAssetPath("media/flags/spain.svg"),
    //     name: "Spanish",
    //   },
    //   de: {
    //     flag: getAssetPath("media/flags/germany.svg"),
    //     name: "German",
    //   },
    //   ja: {
    //     flag: getAssetPath("media/flags/japan.svg"),
    //     name: "Japanese",
    //   },
    //   fr: {
    //     flag: getAssetPath("media/flags/france.svg"),
    //     name: "French",
    //   },
    // };

    const signOut = () => {
      store.logout();
      router.push({ name: "sign-in" });
    };

    const setLang = (lang: string) => {
      localStorage.setItem("lang", lang);
      i18n.locale.value = lang;
    };

    const currentLanguage = computed(() => {
      return i18n.locale.value;
    });

    // const currentLangugeLocale = computed(() => {
    //   return countries[i18n.locale.value as keyof typeof countries];
    // });

    return {
      signOut,
      setLang,
      currentLanguage,
      // currentLangugeLocale,
      // countries,
      getAssetPath,
      user,
    };
  },
});
</script>
