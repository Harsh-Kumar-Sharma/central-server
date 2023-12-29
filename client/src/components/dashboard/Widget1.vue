<template>
  <!--begin::List Widget 6-->
  <div class="card" :class="widgetClasses" style="height:630px;">
    <!--begin::Header-->
    <div class="card-header border-0">
      <h3 class="card-title fw-bold text-dark">Plaza Entry Traffic Count</h3>
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
              {{ item.EntryCount }}
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
          EntryCount: null,
          MerageCount: null,
          deffernce: null
        },
        {
          color: "success",
          icon: getAssetPath("media/icons/duotune/communication/com012.svg"),
          title: "Total Transactions",
          EntryCount: null,
          MerageCount: null,
          deffernce: null
        },
        {
          color: "dark",
          icon: getAssetPath("media/icons/duotune/communication/com012.svg"),
          title: "Sarai Kale Khan Plaza",
          EntryCount: null,
          MerageCount: null,
          deffernce: null
        },
        {
          color: "dark",
          icon: getAssetPath("media/icons/duotune/communication/com012.svg"),
          title: "Indirapuram Plaza",
          EntryCount: null,
          MerageCount: null,
          deffernce: null
        },
        {
          color: "dark",
          icon: getAssetPath("media/icons/duotune/communication/com012.svg"),
          title: "Dundahera Plaza",
          EntryCount: null,
          MerageCount: null,
          deffernce: null
        },
        {
          color: "dark",
          icon: getAssetPath("media/icons/duotune/communication/com012.svg"),
          title: "Dasna Plaza",
          EntryCount: null,
          MerageCount: null,
          deffernce: null
        },
        {
          color: "info",
          icon: getAssetPath("media/icons/duotune/communication/com012.svg"),
          title: "Rasoolpur Sikrod Plaza",
          EntryCount: null,
          MerageCount: null,
          deffernce: null
        },
        {
          color: "info",
          icon: getAssetPath("media/icons/duotune/communication/com012.svg"),
          title: "Bhojpur Plaza",
          EntryCount: null,
          MerageCount: null,
          deffernce: null
        },
        {
          color: "info",
          icon: getAssetPath("media/icons/duotune/communication/com012.svg"),
          title: "Kashi Plaza",
          EntryCount: null,
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
        this.list[0].EntryCount = 'EntryCount';
        this.list[1].EntryCount = this.statistics.plazaWiseCountEntry.plazaWiseCountEntry.totalCount
        this.list[2].EntryCount = this.statistics.plazaWiseCountEntry.plazaWiseCountEntry.SaraiKaleKhan
        this.list[3].EntryCount = this.statistics.plazaWiseCountEntry.plazaWiseCountEntry.Indirapuram
        this.list[4].EntryCount = this.statistics.plazaWiseCountEntry.plazaWiseCountEntry.Dundahera
        this.list[5].EntryCount = this.statistics.plazaWiseCountEntry.plazaWiseCountEntry.Dasna
        this.list[6].EntryCount = this.statistics.plazaWiseCountEntry.plazaWiseCountEntry.RasoolpurSikrod
        this.list[7].EntryCount = this.statistics.plazaWiseCountEntry.plazaWiseCountEntry.Bhojpur
        this.list[8].EntryCount = this.statistics.plazaWiseCountEntry.plazaWiseCountEntry.Kashi

        this.list[0].MerageCount = 'MergeEntry';
        this.list[1].MerageCount = this.statistics.plazaWiseCountEntry.merageTransaction.totalCount
        this.list[2].MerageCount = this.statistics.plazaWiseCountEntry.merageTransaction.SaraKaleKhan
        this.list[3].MerageCount = this.statistics.plazaWiseCountEntry.merageTransaction.Indirapuram
        this.list[4].MerageCount = this.statistics.plazaWiseCountEntry.merageTransaction.Dundahera
        this.list[5].MerageCount = this.statistics.plazaWiseCountEntry.merageTransaction.Dasna
        this.list[6].MerageCount = this.statistics.plazaWiseCountEntry.merageTransaction.RasoolpurSikrod
        this.list[7].MerageCount = this.statistics.plazaWiseCountEntry.merageTransaction.Bhojpur
        this.list[8].MerageCount = this.statistics.plazaWiseCountEntry.merageTransaction.Kashi

        this.list[0].deffernce = 'Defference';
        this.list[1].deffernce = this.statistics.plazaWiseCountEntry.plazaWiseCountEntry.totalCount - this.statistics.plazaWiseCountEntry.merageTransaction.totalCount
        this.list[2].deffernce = this.statistics.plazaWiseCountEntry.plazaWiseCountEntry.SaraiKaleKhan - this.statistics.plazaWiseCountEntry.merageTransaction.SaraKaleKhan
        this.list[3].deffernce = this.statistics.plazaWiseCountEntry.plazaWiseCountEntry.Indirapuram - this.statistics.plazaWiseCountEntry.merageTransaction.Indirapuram
        this.list[4].deffernce = this.statistics.plazaWiseCountEntry.plazaWiseCountEntry.Dundahera - this.statistics.plazaWiseCountEntry.merageTransaction.Dundahera
        this.list[5].deffernce = this.statistics.plazaWiseCountEntry.plazaWiseCountEntry.Dasna - this.statistics.plazaWiseCountEntry.merageTransaction.Dasna
        this.list[6].deffernce = this.statistics.plazaWiseCountEntry.plazaWiseCountEntry.RasoolpurSikrod - this.statistics.plazaWiseCountEntry.merageTransaction.RasoolpurSikrod
        this.list[7].deffernce = this.statistics.plazaWiseCountEntry.plazaWiseCountEntry.Bhojpur - this.statistics.plazaWiseCountEntry.merageTransaction.Bhojpur
        this.list[8].deffernce = this.statistics.plazaWiseCountEntry.plazaWiseCountEntry.Kashi - this.statistics.plazaWiseCountEntry.merageTransaction.Kashi
      }
    },
  },
});
</script>
