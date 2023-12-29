<template>
  <!--begin::List Widget 6-->
  <div class="card" :class="widgetClasses" style="height:620px;">
    <!--begin::Header-->
    <div class="card-header border-0">
      <h3 class="card-title fw-bold text-dark">Server Sync Time</h3>
      <!--end::Header-->
    </div>

    <!-- loader -->
    <div v-if="loader">
      <Loader />
    </div>

    <!--begin::Body-->
    <div class="card-body" v-else>
      <template v-for="(item, index) in list" :key="index">
        <!--begin::Item-->
        <div :class="[
          'mb-7' && list.length - 1 !== index,
          `bg-light`,
        ]" class="d-flex align-items-center rounded p-3 mb-4">
          <KTIcon icon-name="abstract-26" :icon-class="`text-light fs-1 me-5`" />

          <!--begin::Title-->
          <div class="col-5">
            <span class="fw-bold text-gray-800 text-hover-primary fs-6">
              {{ item.PLAZA_NAME }}
            </span>
          </div>
          <div class="col-3">
            <span class="fw-bold text-gray-800 text-hover-primary fs-6">
              {{ item.LAST_DATA_RCVD.replace(/(\.\d{3})?Z$/, '').replace('T', ' ') }}
            </span>
          </div>
          <div class="col-3 text-center">
            <span class="fw-bold text-gray-800 text-hover-primary fs-6">
              {{ item.DELAY }}
            </span>
          </div>
          <!--end::Lable-->
        </div>
        <!--end::Item-->
      </template>
    </div>
    <!--end::Body-->
  </div>
  <!--end::List Widget 6-->
</template>

<script>
import { defineComponent, ref } from "vue";
import { dashboardStats } from "../../stores/dashboard";
import Loader from "@/layouts/Loader.vue";
const dashboardStore = dashboardStats();

export default defineComponent({
  name: "kt-widget-6",
  components: {
    Loader,
  },
  props: {
    widgetClasses: String,
  },

  data() {
    return {
      loader: true,
      statistics: {},
      list: [],
    };
  },

  computed: {
    getStatisticsData() {
      return dashboardStore.getStatistics;
    },
  },

  watch: {
    getStatisticsData: function () {
      this.statistics = this.getStatisticsData;
      if (this.statistics.apiFetchStatus) {
        this.loader = false;
        this.list = [{
          PLAZA_NAME: "Plaza Name",
          LAST_DATA_RCVD: "LAST DATA RCVD",
          DELAY: "Delay Time In Sec"
        }, ...this.statistics.apiFetchStatus]
      }
    },
  },
});
</script>
