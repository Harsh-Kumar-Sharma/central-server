<template>
  <div class="animate__animated animate__fadeIn">
    <div class="row">
      <Widget7 widget-classes="card-xl-stretch mb-xl-8" widget-color="info" chart-height="100" stroke-color="#4e12c4">
      </Widget7>
    </div>
    <div class="row g-5 g-xl-8">
      <!--begin::Col-->
      <div class="col-xl-6">
        <Widget1 widget-classes="card-xl-stretch mb-xl-8" widget-color="info" chart-height="100" stroke-color="#4e12c4">
        </Widget1>
      </div>
      <!--end::Col-->


      <!--begin::Col-->
      <div class="col-xl-6">
        <Widget3 widget-classes="card-xl-stretch mb-xl-8" widget-color="danger" chart-height="100"></Widget3>
      </div>
      <!--end::Col-->
      <!-- </div> -->

      <!-- Next Row -->
      <div class="row ">
        <!-- begin::Col-->
        <div class="col-xl-4">
          <Widget4 widget-classes="card-xl-stretch mb-xl-8" chart-height="200" stroke-color="#4e12c4"></Widget4>
        </div>
        <!--end::Col-->
        <div class="col-xl-4">
          <Widget5 widget-classes="card-xl-stretch mb-xl-8" widget-color="info" chart-height="100" stroke-color="#4e12c4">
          </Widget5>
        </div>
        <div class="col-xl-4">
          <Widget6 widget-classes="card-xl-stretch mb-xl-8" widget-color="info" chart-height="100" stroke-color="#4e12c4">
          </Widget6>
        </div>
      </div>
      <div class="row">
        <div class="col-xl-6">
          <Widget2 widget-classes="card-xl-stretch mb-xl-8" widget-color="danger" chart-height="100"></Widget2>
        </div>
        <div class="col-xl-6">
          <Widget8 widget-classes="card-xl-stretch mb-xl-8" widget-color="danger" chart-height="100"></Widget8>
        </div>
      </div>
    </div>
    <Modal />
  </div>
</template>

<script>
import { defineComponent } from "vue";
import Widget1 from "@/components/dashboard/Widget1.vue";
import Widget2 from "@/components/dashboard/Widget2.vue";
import Widget3 from "@/components/dashboard/Widget3.vue";
import Widget4 from "@/components/dashboard/Widget4.vue";
import Widget5 from "@/components/dashboard/Widget5.vue";
import Widget6 from "@/components/dashboard/Widget6.vue";
import Widget7 from "@/components/dashboard/Widget7.vue";
import Widget8 from "@/components/dashboard/Widget8.vue";
import { useThemeStore } from "../stores/theme";
import { useMasterData } from "../stores/common";
import { dashboardStats } from "../stores/dashboard";
const dashboardStore = dashboardStats();
import Swal from "sweetalert2";

const store = useMasterData();

export default defineComponent({
  name: "main-dashboard",
  components: {
    Widget1,
    Widget2,
    Widget3,
    Widget4,
    Widget5,
    Widget6,
    Widget7,
    Widget8,
  },
  data() {
    return {
      themeStore: useThemeStore(),
    };
  },

  computed: {
    getStatistics() {
      return dashboardStore.getStatistics;
    },
  },

  methods: {},

  async mounted() {
    try {
      this.themeStore.setLoader(true);
      await store.getMasterData();
      await dashboardStore.getStatisticsData();
      this.themeStore.setLoader(false);
    } catch (e) {
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
