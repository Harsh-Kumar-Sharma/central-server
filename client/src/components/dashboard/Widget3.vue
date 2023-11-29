<template>
  <div :class="widgetClasses" class="card">
    <!--begin::Header-->
    <div class="card-header border-0 py-5">
      <h3 class="card-title fw-bold text-dark fs-3">
        Lane Information {{ series.data }}
      </h3>
    </div>
    <!--end::Header-->
    <div v-if="loader"><Loader /></div>
    <!--begin::Body-->
    <div v-else class="card-body p-0">
      <apexchart
        type="bar"
        height="200"
        :options="chartOptions"
        :series="series"
        ref="chartRef"
        class="mixed-widget-12-chart card-rounded-bottom"
      ></apexchart>

      <!-- lane statistics -->
      <div class="p-5">
        <h5>LHS</h5>
        <ul>
          <li>
            <div
              class="d-flex flex-column content-justify-center flex-row-fluid"
            >
              <!--begin::Label-->
              <div class="d-flex fw-semibold align-items-center">
                <!--begin::Bullet-->
                <div class="bullet w-8px h-3px rounded-2 bg-success me-3"></div>
                <!--end::Bullet-->

                <!--begin::Label-->
                <div class="text-gray-500 flex-grow-1 me-4">Total</div>

                <!--end::Label-->

                <!--begin::Stats-->
                <div class="fw-bolder text-gray-700 text-xxl-end">
                  {{ lhs.total }}
                </div>
                <!--end::Stats-->
              </div>
              <!--end::Label-->
            </div>
          </li>
          <li>
            <div
              class="d-flex flex-column content-justify-center flex-row-fluid"
            >
              <!--begin::Label-->
              <div class="d-flex fw-semibold align-items-center">
                <!--begin::Bullet-->
                <div class="bullet w-8px h-3px rounded-2 bg-success me-3"></div>
                <!--end::Bullet-->

                <!--begin::Label-->
                <div class="text-gray-500 flex-grow-1 me-4">Open Lane</div>

                <!--end::Label-->

                <!--begin::Stats-->
                <div class="fw-bolder text-gray-700 text-xxl-end">
                  {{ lhs.open }}
                </div>
                <!--end::Stats-->
              </div>
            </div>
            <!--end::Label-->
          </li>
          <li>
            <div
              class="d-flex flex-column content-justify-center flex-row-fluid"
            >
              <!--begin::Label-->
              <div class="d-flex fw-semibold align-items-center">
                <!--begin::Bullet-->
                <div class="bullet w-8px h-3px rounded-2 bg-success me-3"></div>
                <!--end::Bullet-->

                <!--begin::Label-->
                <div class="text-gray-500 flex-grow-1 me-4">Closed Lane</div>

                <!--end::Label-->

                <!--begin::Stats-->
                <div class="fw-bolder text-gray-700 text-xxl-end">
                  {{ lhs.closed }}
                </div>
                <!--end::Stats-->
              </div>
            </div>
            <!--end::Label-->
          </li>
        </ul>
      </div>

      <h5 class="ms-4">RHS</h5>
      <ul>
        <li>
          <div class="d-flex flex-column content-justify-center flex-row-fluid">
            <!--begin::Label-->
            <div class="d-flex fw-semibold align-items-center">
              <!--begin::Bullet-->
              <div class="bullet w-8px h-3px rounded-2 bg-success ms-3"></div>
              <!--end::Bullet-->

              <!--begin::Label-->
              <div class="text-gray-500 flex-grow-1 ms-4">Total</div>

              <!--end::Label-->

              <!--begin::Stats-->
              <div class="fw-bolder text-gray-700 text-xxl-end me-5">
                {{ rhs.total }}
              </div>
              <!--end::Stats-->
            </div>
            <!--end::Label-->
          </div>
        </li>
        <li>
          <div class="d-flex flex-column content-justify-center flex-row-fluid">
            <!--begin::Label-->
            <div class="d-flex fw-semibold align-items-center">
              <!--begin::Bullet-->
              <div class="bullet w-8px h-3px rounded-2 bg-success ms-3"></div>
              <!--end::Bullet-->

              <!--begin::Label-->
              <div class="text-gray-500 flex-grow-1 ms-4">Open Lane</div>

              <!--end::Label-->

              <!--begin::Stats-->
              <div class="fw-bolder text-gray-700 text-xxl-end me-5">
                {{ rhs.open }}
              </div>
              <!--end::Stats-->
            </div>
          </div>
          <!--end::Label-->
        </li>
        <li>
          <div class="d-flex flex-column content-justify-center flex-row-fluid">
            <!--begin::Label-->
            <div class="d-flex fw-semibold align-items-center">
              <!--begin::Bullet-->
              <div class="bullet w-8px h-3px rounded-2 bg-success ms-3"></div>
              <!--end::Bullet-->

              <!--begin::Label-->
              <div class="text-gray-500 flex-grow-1 ms-4">Closed Lane</div>

              <!--end::Label-->

              <!--begin::Stats-->
              <div class="fw-bolder text-gray-700 text-xxl-end me-5">
                {{ rhs.closed }}
              </div>
              <!--end::Stats-->
            </div>
          </div>
          <!--end::Label-->
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { dashboardStats } from "../../stores/dashboard";
const dashboardStore = dashboardStats();
import Loader from "@/layouts/Loader.vue";
import { getCSSVariableValue } from "@/assets/ts/_utils";
import Datatable from "@/components/kt-datatable/KTDataTable.vue";

export default defineComponent({
  props: {
    widgetClasses: String,
    chartHeight: String,
  },
  components: {
    Loader,
  },
  data() {
    return {
      loader: true,
      series: <any>[],
      lhs: <any>{},
      rhs: <any>{},
      chartOptions: {
        chart: {
          type: "bar",
          height: 10,
          stacked: true,
          foreColor: "#ccc",
          toolbar: {
            show: false,
          },
        },
        plotOptions: {
          bar: {
            horizontal: true,
            borderRadius: 2,
            dataLabels: {
              total: {
                enabled: false,
                offsetX: 0,
                style: {
                  fontSize: "13px",
                  fontWeight: 900,
                },
              },
            },
          },
        },

        xaxis: {
          categories: ["LHS", "RHS"],
          axisBorder: {
            show: false,
          },
          axisTicks: {
            show: false,
          },
          labels: {
            formatter: function (val) {
              return val;
            },
          },
        },

        grid: {
          padding: {
            top: 10,
          },
          borderColor: getCSSVariableValue("--bs-gray-200"),
          strokeDashArray: 4,
          yaxis: {
            lines: {
              show: true,
            },
          },
        },

        fill: {
          opacity: 1,
        },
        legend: {
          position: "top",
          horizontalAlign: "left",
          offsetX: 40,
        },
      },
    };
  },
  computed: {
    getLaneInformationStatus(): any {
      return dashboardStore.getStatistics;
    },
  },

  watch: {
    getLaneInformationStatus: function () {
      this.getChartData();
      this.getlhsData();
    },
  },

  methods: {
    async getChartData() {
      if (this.getLaneInformationStatus.laneInformation) {
        this.loader = false;
        this.series = await [
          {
            name: "Open Lanes",
            data: [
              this.getLaneInformationStatus.laneInformation.lhs.open,
              this.getLaneInformationStatus.laneInformation.rhs.open,
            ],
          },
          {
            name: "Closed Lanes",
            data: [
              this.getLaneInformationStatus.laneInformation.lhs.closed,
              this.getLaneInformationStatus.laneInformation.rhs.closed,
            ],
          },
        ];
      }
    },
    async getlhsData() {
      if (this.getLaneInformationStatus.laneInformation) {
        this.lhs = await {
          open: this.getLaneInformationStatus.laneInformation.lhs.open,
          closed: this.getLaneInformationStatus.laneInformation.lhs.closed,
          total: this.getLaneInformationStatus.laneInformation.lhs.count,
        };
      }
      if (this.getLaneInformationStatus.laneInformation) {
        this.rhs = await {
          open: this.getLaneInformationStatus.laneInformation.rhs.open,
          closed: this.getLaneInformationStatus.laneInformation.rhs.closed,
          total: this.getLaneInformationStatus.laneInformation.rhs.count,
        };
      }
    },
  },
});
</script>
