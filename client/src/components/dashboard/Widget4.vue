<template>
  <!--begin::List Widget 6-->
  <div class="card" :class="widgetClasses" style="height:590px;">
    <!--begin::Header-->
    <div class="card-header border-0">
      <h3 class="card-title fw-bold text-dark">Plaza Total Transaction Count</h3>
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
          `bg-light-${item.color}`,
        ]" class="d-flex align-items-center rounded p-3 mb-4">
          <KTIcon icon-name="abstract-26" :icon-class="`text-${item.color} fs-1 me-5`" />

          <!--begin::Title-->
          <div class="flex-grow-1 me-2">
            <span class="fw-bold text-gray-800 text-hover-primary fs-6">
              {{ item.title }}
            </span>
          </div>
          <!--end::Title-->

          <!--begin::Lable-->
          <span :class="`text-${item.color}`" class="fw-bold py-1">{{
            item.number
          }}</span>
          <!--end::Lable-->
        </div>
        <!--end::Item-->
      </template>
    </div>
    <!--end::Body-->
  </div>
  <!--end::List Widget 6-->
</template>


<script lang="ts">
import { getAssetPath } from "@/core/helpers/assets";
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
      statistics: <any>[],
      list: [
        {
          color: "success",
          icon: getAssetPath("media/icons/duotune/communication/com012.svg"),
          title: "Total Transactions",
          number: null,
        },
        {
          color: "dark",
          icon: getAssetPath("media/icons/duotune/communication/com012.svg"),
          title: "Sarai Kale Khan Plaza",
          number: null,
        },
        {
          color: "dark",
          icon: getAssetPath("media/icons/duotune/communication/com012.svg"),
          title: "Indirapuram Plaza",
          number: null,
        },
        {
          color: "dark",
          icon: getAssetPath("media/icons/duotune/communication/com012.svg"),
          title: "Dundahera Plaza",
          number: null,
        },
        {
          color: "dark",
          icon: getAssetPath("media/icons/duotune/communication/com012.svg"),
          title: "Dasna Plaza",
          number: null,
        },
        {
          color: "info",
          icon: getAssetPath("media/icons/duotune/communication/com012.svg"),
          title: "Rasoolpur Sikrod Plaza",
          number: null,
        },
        {
          color: "info",
          icon: getAssetPath("media/icons/duotune/communication/com012.svg"),
          title: "Bhojpur Plaza",
          number: null,
        },
        {
          color: "info",
          icon: getAssetPath("media/icons/duotune/communication/com012.svg"),
          title: "Kashi Plaza",
          number: null,
        }
      ],
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
      if (this.statistics.plazaWiseCount) {
        this.loader = false;
        this.list[0].number = this.statistics.plazaWiseCount.totalCount
        this.list[1].number = this.statistics.plazaWiseCount.SaraiKaleKhan
        this.list[2].number = this.statistics.plazaWiseCount.Indirapuram
        this.list[3].number = this.statistics.plazaWiseCount.Dundahera
        this.list[4].number = this.statistics.plazaWiseCount.Dasna
        this.list[5].number = this.statistics.plazaWiseCount.RasoolpurSikrod
        this.list[6].number = this.statistics.plazaWiseCount.Bhojpur
        this.list[7].number = this.statistics.plazaWiseCount.Kashi
      }
    },
  },
});
</script>
