<template>
  <!--begin::List Widget 6-->
  <div class="card" :class="widgetClasses" style="height: 580px">
    <!--begin::Header-->
    <div class="card-header border-0">
      <h3 class="card-title fw-bold text-dark">Transaction Status</h3>
      <!--end::Header-->
      <div class="d-flex flex-wrap my-1 mt-4">
        <!--begin::Select wrapper-->
        <div class="m-0">
          <!--begin::Select-->
          <select name="status" v-model="durationTime" @change="duration" data-hide-search="true"
            class="form-select form-select-white form-select-sm fw-bold w-125px">
            <option value="DAY" selected>DAY</option>
            <option value="WEEK">WEEK</option>
            <option value="MONTH">MONTH</option>
            <option value="YEAR">YEAR</option>
          </select>
          <!--end::Select-->
        </div>
        <!--end::Select wrapper-->
      </div>
      <!--end::Controls-->
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
import Dropdown3 from "@/components/dropdown/Dropdown3.vue";
import { dashboardStats } from "../../stores/dashboard";
import Loader from "@/layouts/Loader.vue";
const dashboardStore = dashboardStats();

export default defineComponent({
  name: "kt-widget-6",
  components: {
    Dropdown3,
    Loader,
  },
  props: {
    widgetClasses: String,
  },

  data() {
    return {
      loader: true,
      statistics: <any>[],
      durationTime: "DAY",
      list: [
        {
          color: "primary",
          icon: getAssetPath("media/icons/duotune/communication/com012.svg"),
          title: "Total Transactions",
          number: null,
        },
        {
          color: "warning",
          icon: getAssetPath("media/icons/duotune/abstract/abs027.svg"),
          title: "FASTag Transactions",
          number: null,
        },
        {
          color: "success",
          icon: getAssetPath("media/icons/duotune/art/art005.svg"),
          title: "Cash Transactions",
          number: null,
        },
        {
          color: "danger",
          icon: getAssetPath("media/icons/duotune/communication/com012.svg"),
          title: "Exempt Transactions",
          number: null,
        },
        {
          color: "info",
          icon: getAssetPath("media/icons/duotune/communication/com012.svg"),
          title: "Convoy Transactions",
          number: null,
        },
        {
          color: "danger",
          icon: getAssetPath("media/icons/duotune/communication/com012.svg"),
          title: "Voilation Transactions",
          number: null,
        },
        {
          color: "dark",
          icon: getAssetPath("media/icons/duotune/communication/com012.svg"),
          title: "Cancel Payment",
          number: null,
        },
      ],
    };
  },

  computed: {
    getTransactionStatus() {
      return dashboardStore.getCountTranscation;
    },
  },

  watch: {
    getTransactionStatus: function () {
      this.statistics = this.getTransactionStatus;
      if (this.statistics.transactionStatus) {
        this.loader = false;
        this.list[0].number = this.statistics.transactionStatus.totalCount;
        this.list[1].number = this.statistics.transactionStatus.FASTag;
        this.list[2].number = this.statistics.transactionStatus.Cash;
        this.list[3].number = this.statistics.transactionStatus.Exempt;
        this.list[4].number = this.statistics.transactionStatus.Convoy;
        this.list[5].number = this.statistics.transactionStatus.Voilation;
        this.list[6].number = this.statistics.transactionStatus.CancelPayment;
      }
    },
  },
  methods: {
    async duration() {
      this.loader = true;
      await dashboardStore.getCountTranscationData(this.durationTime);
    }
  }
});
</script>
