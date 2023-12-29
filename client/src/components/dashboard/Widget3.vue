<template>
  <!--begin::List Widget 6-->
  <div class="card" :class="widgetClasses" style="height:630px;">
    <!--begin::Header-->
    <div class="card-header border-0">
      <h3 class="card-title fw-bold text-dark">Plaza Exit Traffic Count</h3>
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
          <div class="col-4">
            <span class="fw-bold text-gray-800 text-hover-primary fs-6">
              {{ item.title }}
            </span>
          </div>
          <div class="col-3">
            <span class="fw-bold text-gray-800 text-hover-primary fs-6">
              {{ item.ExitCount }}
            </span>
          </div>
          <div class="col-3">
            <span class="fw-bold text-gray-800 text-hover-primary fs-6">
              {{ item.MerageCount }}
            </span>
          </div>
          <div class="col-3">
            <span class="fw-bold text-gray-800 text-hover-primary fs-6">
              {{ item.deffernce }}
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
      statistics: {},
      list: [
        {
          color: "white",
          icon: getAssetPath("media/icons/duotune/communication/com012.svg"),
          title: "Plaza's",
          ExitCount: null,
          MerageCount: null,
          deffernce: null
        },
        {
          color: "success",
          icon: getAssetPath("media/icons/duotune/communication/com012.svg"),
          title: "Total Transactions",
          ExitCount: null,
          MerageCount: null,
          deffernce: null
        },
        {
          color: "dark",
          icon: getAssetPath("media/icons/duotune/communication/com012.svg"),
          title: "Sarai Kale Khan Plaza",
          ExitCount: null,
          MerageCount: null,
          deffernce: null
        },
        {
          color: "dark",
          icon: getAssetPath("media/icons/duotune/communication/com012.svg"),
          title: "Indirapuram Plaza",
          ExitCount: null,
          MerageCount: null,
          deffernce: null
        },
        {
          color: "dark",
          icon: getAssetPath("media/icons/duotune/communication/com012.svg"),
          title: "Dundahera Plaza",
          ExitCount: null,
          MerageCount: null,
          deffernce: null
        },
        {
          color: "dark",
          icon: getAssetPath("media/icons/duotune/communication/com012.svg"),
          title: "Dasna Plaza",
          ExitCount: null,
          MerageCount: null,
          deffernce: null
        },
        {
          color: "info",
          icon: getAssetPath("media/icons/duotune/communication/com012.svg"),
          title: "Rasoolpur Sikrod Plaza",
          ExitCount: null,
          MerageCount: null,
          deffernce: null
        },
        {
          color: "info",
          icon: getAssetPath("media/icons/duotune/communication/com012.svg"),
          title: "Bhojpur Plaza",
          ExitCount: null,
          MerageCount: null,
          deffernce: null
        },
        {
          color: "info",
          icon: getAssetPath("media/icons/duotune/communication/com012.svg"),
          title: "Kashi Plaza",
          ExitCount: null,
          MerageCount: null,
          deffernce: null
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
      if (this.statistics.plazaWiseCountEntry) {
        this.loader = false;
        this.list[0].ExitCount = 'ExitCount';
        this.list[1].ExitCount = this.statistics.plazaWiseCountExit.plazaWiseCountExit.totalCount
        this.list[2].ExitCount = this.statistics.plazaWiseCountExit.plazaWiseCountExit.SaraiKaleKhan
        this.list[3].ExitCount = this.statistics.plazaWiseCountExit.plazaWiseCountExit.Indirapuram
        this.list[4].ExitCount = this.statistics.plazaWiseCountExit.plazaWiseCountExit.Dundahera
        this.list[5].ExitCount = this.statistics.plazaWiseCountExit.plazaWiseCountExit.Dasna
        this.list[6].ExitCount = this.statistics.plazaWiseCountExit.plazaWiseCountExit.RasoolpurSikrod
        this.list[7].ExitCount = this.statistics.plazaWiseCountExit.plazaWiseCountExit.Bhojpur
        this.list[8].ExitCount = this.statistics.plazaWiseCountExit.plazaWiseCountExit.Kashi

        this.list[0].MerageCount = 'MergeExit';
        this.list[1].MerageCount = this.statistics.plazaWiseCountExit.merageTransaction.totalCount
        this.list[2].MerageCount = this.statistics.plazaWiseCountExit.merageTransaction.SaraKaleKhan
        this.list[3].MerageCount = this.statistics.plazaWiseCountExit.merageTransaction.Indirapuram
        this.list[4].MerageCount = this.statistics.plazaWiseCountExit.merageTransaction.Dundahera
        this.list[5].MerageCount = this.statistics.plazaWiseCountExit.merageTransaction.Dasna
        this.list[6].MerageCount = this.statistics.plazaWiseCountExit.merageTransaction.RasoolpurSikrod
        this.list[7].MerageCount = this.statistics.plazaWiseCountExit.merageTransaction.Bhojpur
        this.list[8].MerageCount = this.statistics.plazaWiseCountExit.merageTransaction.Kashi

        this.list[0].deffernce = 'Defference';
        this.list[1].deffernce = this.statistics.plazaWiseCountExit.plazaWiseCountExit.totalCount - this.statistics.plazaWiseCountExit.merageTransaction.totalCount
        this.list[2].deffernce = this.statistics.plazaWiseCountExit.plazaWiseCountExit.SaraiKaleKhan - this.statistics.plazaWiseCountExit.merageTransaction.SaraKaleKhan
        this.list[3].deffernce = this.statistics.plazaWiseCountExit.plazaWiseCountExit.Indirapuram - this.statistics.plazaWiseCountExit.merageTransaction.Indirapuram
        this.list[4].deffernce = this.statistics.plazaWiseCountExit.plazaWiseCountExit.Dundahera - this.statistics.plazaWiseCountExit.merageTransaction.Dundahera
        this.list[5].deffernce = this.statistics.plazaWiseCountExit.plazaWiseCountExit.Dasna - this.statistics.plazaWiseCountExit.merageTransaction.Dasna
        this.list[6].deffernce = this.statistics.plazaWiseCountExit.plazaWiseCountExit.RasoolpurSikrod - this.statistics.plazaWiseCountExit.merageTransaction.RasoolpurSikrod
        this.list[7].deffernce = this.statistics.plazaWiseCountExit.plazaWiseCountExit.Bhojpur - this.statistics.plazaWiseCountExit.merageTransaction.Bhojpur
        this.list[8].deffernce = this.statistics.plazaWiseCountExit.plazaWiseCountExit.Kashi - this.statistics.plazaWiseCountExit.merageTransaction.Kashi
      }
    },
  },
});
</script>
