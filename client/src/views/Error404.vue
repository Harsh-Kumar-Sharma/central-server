<template>
  <div class="d-flex flex-column flex-center flex-column-fluid">
    <div class="d-flex flex-column flex-center text-center p-10">
      <div class="card card-flush w-lg-650px py-5">
        <div class="card-body py-15 py-lg-20">
          <h1 class="fw-bolder fs-2hx text-gray-900 mb-4">Oops!</h1>
          <div class="fw-semibold fs-6 text-gray-500 mb-7">
            We can't find that page.
          </div>
          <div class="mb-3">
            <img :src="getAssetPath('media/auth/404-error.png')" class="mw-100 mh-300px theme-light-show" alt="" />
            <img :src="getAssetPath('media/auth/404-error-dark.png')" class="mw-100 mh-300px theme-dark-show" alt="" />
          </div>
          <div class="mb-0">
            <button @click="reRoute" class="btn btn-sm btn-primary">Go Back</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { getAssetPath, getIllustrationsPath } from "@/core/helpers/assets";
import { defineComponent, onMounted } from "vue";
import LayoutService from "@/core/services/LayoutService";
import { useBodyStore } from "@/stores/body";
import { themeMode } from "@/core/helpers/config";

export default defineComponent({
  name: "error-404",
  components: {},
  setup() {
    const storeBody = useBodyStore();

    const bgImage =
      themeMode.value !== "dark"
        ? getAssetPath("media/auth/bg1.jpg")
        : getAssetPath("media/auth/bg1-dark.jpg");

    onMounted(() => {
      LayoutService.emptyElementClassesAndAttributes(document.body);

      storeBody.addBodyClassname("bg-body");
      storeBody.addBodyAttribute({
        qualifiedName: "style",
        value: `background-image: url("${bgImage}")`,
      });
    });

    const reRoute = () => {
      window.history.back()
    }

    return {
      getIllustrationsPath,
      bgImage,
      getAssetPath,
      reRoute
    };
  },
});
</script>
