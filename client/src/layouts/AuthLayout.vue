<template>
  <div class="app-blank bgi-size-cover bgi-attachment-fixed bgi-position-center bgi-no-repeat">
    <div class="content d-flex flex-column flex-root" id="kt_app_root">
      <div class="d-flex flex-column flex-column-fluid flex-lg-row">
        <div class="d-flex flex-column-fluid flex-lg-row-auto justify-content-center justify-content-lg-end p-12 p-lg-20">
          <div class="bg-body d-flex flex-column align-items-stretch flex-center rounded-4 w-md-600px p-15 glass-effect">
            <router-view></router-view>
            <div class="d-flex flex-stack px-lg-10">
              <div class="me-0">
                <a href="javascript:void()">&copy; 2023. National Highways Authority of India.</a>
              </div>
              <div class="d-flex fw-semibold text-primary fs-base gap-5">
                <a href="javascript:void()">Proudly Made in India ♥</a>
              </div>
            </div>
          </div>
        </div>
        <div class="d-flex flex-center w-lg-50 pt-10 pt-lg-0 px-10">
          <div class="text-center">
            <div class="mb-10">
              <img class="nhai-logo" alt="NHAI" src="../assets/images/nhai.png" />
              <h4 class="text-white fw-normal m-0 mt-2">National Highways Authority of India</h4>
            </div>
            <h1 class="text-white fw-normal m-4 tms-text">Anpr Management System</h1>
            <h2 class="text-white fw-normal m-0 atms-text">Administration System</h2>
          </div>
        </div>

      </div>
    </div>
    <img id="bgVideo" src="../assets/images/toll.webp" />
  </div>
</template>

<script lang="ts">
import { getAssetPath } from "@/core/helpers/assets";
import { defineComponent, onMounted } from "vue";
import LayoutService from "@/core/services/LayoutService";
import { useBodyStore } from "@/stores/body";

export default defineComponent({
  name: "auth-layout",
  components: {},
  setup() {
    const store = useBodyStore();

    onMounted(() => {
      LayoutService.emptyElementClassesAndAttributes(document.body);

      store.addBodyClassname("app-blank");
      store.addBodyClassname("bg-body");
    });

    return {
      getAssetPath,
    };
  },
});
</script>
<style>
#bgVideo {
  position: fixed;
  right: 0;
  bottom: 0;
  min-width: 100%;
  min-height: 100%;
  z-index: 1;
  /* height: 100vh; */
  width: 100%;
}

.content {
  position: fixed;
  top: 0;
  background: rgba(0, 0, 0, 0.7);
  color: #f1f1f1;
  width: 100%;
  z-index: 2;
  height: 100vh;
}

.nhai-logo {
  width: 200px;
  border-radius: 10%;
}

.tms-text {
  font-size: 40px;
}

.sajag-login-text {
  font-size: 40px;
}

.atms-text {
  font-size: 25px;
}

.glass-effect {
  background-color: rgba(5, 6, 15, 0.6) !important;
  backdrop-filter: blur(5px);
}
</style>