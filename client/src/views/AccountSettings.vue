<template>
  <div>
    <Settings />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Settings from "@/views/crafted/account/Settings.vue";

export default defineComponent({
  name: "kt-account",
  components: {
    Settings,
  },
  setup() {
    return {};
  },
});
</script>
