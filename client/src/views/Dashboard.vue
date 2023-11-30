<template>
  <div class="animate__animated animate__fadeIn">
    dashboard
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useThemeStore } from "../stores/theme";
import { useMasterData } from "../stores/common";
import Swal from "sweetalert2";

const store = useMasterData();

export default defineComponent({
  name: "main-dashboard",
  components: {},

  data() {
    return {
      themeStore: useThemeStore(),
    };
  },

  computed: {
  },

  methods: {},

  async mounted() {
    try {
      this.themeStore.setLoader(true);
      await store.getMasterData();
      this.themeStore.setLoader(false);
    } catch (e: any) {
      Swal.fire({
        title: "Ooops! Something went wrong",
        text: `Failed to get data from the server: ${e.response ? e.response.data.message : e
          }`,
        icon: "error",
        showConfirmButton: false,
        showCancelButton: false,
        timer: 3000,
      });
      this.themeStore.setLoader(false);
    }
  },
});
</script>
