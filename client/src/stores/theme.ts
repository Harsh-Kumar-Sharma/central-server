import { ref } from "vue";
import { defineStore } from "pinia";
import { ThemeModeComponent } from "@/assets/ts/layout";

export const THEME_MODE_LS_KEY = "kt_theme_mode_value";
export const THEME_MENU_MODE_LS_KEY = "kt_theme_mode_menu";

export const useThemeStore = defineStore("theme", () => {
  const mode = ref<"light" | "dark" | "system">(
    localStorage.getItem(THEME_MODE_LS_KEY) as "light" | "dark" | "system"
  );

  const loader = ref<true | false>(false)

  function setThemeMode(payload: "light" | "dark" | "system") {
    let currentMode = payload;
    localStorage.setItem(THEME_MODE_LS_KEY, currentMode);
    localStorage.setItem(THEME_MENU_MODE_LS_KEY, currentMode);
    mode.value = currentMode;

    if (currentMode === "system") {
      currentMode = ThemeModeComponent.getSystemMode();
    }

    document.documentElement.setAttribute("data-bs-theme", currentMode);
    ThemeModeComponent.init();
  }

  function setLoader(state: false | true) {
    loader.value = state
  }

  return {
    mode,
    loader,
    setThemeMode,
    setLoader
  };
});
