<template>
  <!--begin::Mixed Widget 10-->
  <div :class="widgetClasses" class="card" style="height: 580px">
    <div class="card-header border-0 mb-xl-5">
      <h3 class="card-title align-items-start flex-column">
        <span class="card-label fw-bold fs-3 mb-1">
          Vehicle Classification
        </span>
      </h3>
    </div>

    <div v-if="loader">
      <Loader />
    </div>

    <!--begin::Body-->
    <div class="card-body p-5" v-else>
      <!--begin::Chart-->
      <apexchart type="donut" height="200" :options="chartOptions" :series="series" class="mb-5"></apexchart>
      <!--end::Chart-->

      <ul v-for="(value, name, index) in vehicleData">
        <li>
          <div class="d-flex flex-column content-justify-center flex-row-fluid">
            <!--begin::Label-->
            <div class="d-flex fw-semibold align-items-center">
              <!--begin::Bullet-->
              <div class="bullet w-8px h-3px rounded-2 bg-success me-3"></div>
              <!--end::Bullet-->

              <!--begin::Label-->
              <div class="text-gray-500 flex-grow-1 me-4">
                {{ name }}
              </div>
              <!--end::Label-->

              <!--begin::Stats-->
              <div class="fw-bolder text-gray-700 text-xxl-end">
                {{ value }}
              </div>
              <!--end::Stats-->
            </div>
            <!--end::Label-->
          </div>
        </li>
      </ul>
    </div>
  </div>
  <!--end::Mixed Widget 10-->
</template>

<script lang="ts">
import { getAssetPath } from "@/core/helpers/assets";
import { defineComponent } from "vue";
import { dashboardStats } from "../../stores/dashboard";
const dashboardStore = dashboardStats();
import Loader from "@/layouts/Loader.vue";

export default defineComponent({
  name: "default-dashboard-widget-5",
  components: {
    Loader,
  },
  data() {
    return {
      loader: true,
      vehicleData: <any>[],
      series: <any>[],
      chartOptions: {
        chart: {
          height: 500,
          type: "polarArea",
          foreColor: "#ccc",
        },
        dataLabels: {
          enabled: false,
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 300,
              },
            },
          },
        ],
        plotOptions: {
          polarArea: {
            rings: {
              strokeWidth: 1,
              strokeColor: "",
            },
            spokes: {
              strokeWidth: 1,
              connectorColors: "",
            },
          },
        },
        labels: <any>[],
        fill: {
          opacity: 1,
        },
        stroke: {
          show: true,
          curve: "smooth",
          lineCap: "round",
          colors: "#1E1E2D",
          width: 2,
          dashArray: 0,
        },
      },
    };
  },
  props: {
    widgetClasses: String,
    chartColor: String,
    chartHeight: String,
  },

  computed: {
    getTransactionStatus(): any {
      return dashboardStore.getCountTranscation;
    },
  },

  watch: {
    getTransactionStatus: function () {
      this.getChartData();
    },
  },
  methods: {
    async getChartData() {
      if (this.getTransactionStatus.vehicleClassification) {
        this.loader = false;
        this.vehicleData = this.getTransactionStatus.vehicleClassification;
        this.chartOptions.labels = Object.keys(this.vehicleData);
        this.series = Object.values(this.vehicleData);
      }
    },
  },
});
</script>

<style>
ul {
  list-style-type: none;
}
</style>
