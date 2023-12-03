<template>
  <!--begin::Mixed Widget 14-->
  <div :class="widgetClasses" class="card theme-dark-bg-body" :style="`background-color: ${widgetColor}`"
    style="height:590px;">
    <!--begin::Body-->
    <div class="card-body d-flex flex-column">
      <div class="d-flex flex-column mb-7">
        <!--begin::Title-->
        <h3 class="card-title fw-bold text-dark">Plaza Count</h3>
        <!--end::Title-->
      </div>
      <div v-if="loader">
        <Loader />
      </div>
      <div v-else id="chart mt-6">
        <apexchart type="bar" height="350" :options="chartOptions" :series="series"></apexchart>
      </div>

      <!--begin::Row-->
    </div>
  </div>
  <!--end::Mixed Widget 14-->
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { dashboardStats } from "../../stores/dashboard";
import Loader from "@/layouts/Loader.vue";
const dashboardStore = dashboardStats();

export default defineComponent({
  name: "widget-14",
  props: {
    widgetClasses: String,
    widgetColor: String,
  },
  components: { Loader },
  data() {
    return {
      loader: true,
      statistics: <any>[],
      series: [{
        data: []
      }],
      chartOptions: {
        chart: {
          height: 350,
          type: 'bar',
          events: {
            click: function (chart, w, e) {
              console.log(chart, w, e);
            }
          }
        },

        colors: ['#FF5733', '#33FF57', '#5733FF', '#33A3FF', '#FF33A3', '#A3FF33', '#FF3333'],
        plotOptions: {
          bar: {
            columnWidth: '45%',
            distributed: true,
          }
        },
        dataLabels: {
          enabled: true
        },
        legend: {
          show: true
        },
        xaxis: {
          categories: [
            ['Sarai Kale Khan'],
            ['Indirapuram Plaza'],
            ['Dundahera Plaza'],
            ['Dasna Plaza'],
            ['Rasoolpur Sikrod'],
            ['Bhojpur Plaza'],
            ['Kashi Plaza'],
          ],
          labels: {
            style: {

              colors: ['#FF5733', '#33FF57', '#5733FF', '#33A3FF', '#FF33A3', '#A3FF33', '#FF3333'],
              fontSize: '12px'
            }
          }
        }
      },

    }
  },

  computed: {
    getStatisticsData() {
      return dashboardStore.getStatistics;
    },
  },

  watch: {
    getStatisticsData: function () {
      this.statistics = this.getStatisticsData;
      if (this.statistics.plazaWiseCount) {
        this.loader = false;
        this.series[0].data[0] = this.statistics.plazaWiseCount.SaraiKaleKhan
        this.series[0].data[1] = this.statistics.plazaWiseCount.Indirapuram
        this.series[0].data[2] = this.statistics.plazaWiseCount.Dundahera
        this.series[0].data[3] = this.statistics.plazaWiseCount.Dasna
        this.series[0].data[4] = this.statistics.plazaWiseCount.RasoolpurSikrod
        this.series[0].data[5] = this.statistics.plazaWiseCount.Bhojpur
        this.series[0].data[6] = this.statistics.plazaWiseCount.Kashi
      }
    },
  },
});
</script>
