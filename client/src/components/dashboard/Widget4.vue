<template>
  <!--begin::Table Widget 6-->
  <div :class="widgetClasses" class="card" style="height: 500px">
    <!--begin::Header-->
    <div class="card-header border-0 pt-5">
      <h3 class="card-title align-items-start flex-column">
        <span class="card-label fw-bold fs-3 mb-1">Last Five Transactions</span>
      </h3>
    </div>
    <!--end::Header-->
    <div v-if="loader">
      <Loader />
    </div>
    <!--begin::Body-->
    <div class="card-body py-3 pt-4" v-else>
      <div class="tab-content">
        <!--begin::Tap pane-->

        <!--begin::Table container-->
        <div class="table-responsive">
          <!--begin::Table-->
          <table class="table align-middle gs-0 gy-3">
            <!--begin::Table head-->
            <thead>
              <tr>
                <th class="ps-5 w-50px text-gray-600 fw-bold fs-8">
                  Plate Num
                </th>
                <th class="ps-2 min-w-50px text-gray-600 fw-bold fs-8">
                  Payment
                </th>
                <th class="ps-10 min-w-180px text-gray-600 fw-bold fs-8">
                  Timing
                </th>
                <th class="ps-20 min-w-50px text-gray-600 fw-bold fs-8">Fee</th>
              </tr>
            </thead>
            <!--end::Table head-->
            <div class="separator separator-dashed"></div>
            <!--begin::Table body-->
            <tbody v-for="(item, index) in lastTransaction" :key="index">
              <tr>
                <td>
                  <a class="text-dark fw-bold mb-1 fs-7 ms-5">{{
                    item.TAG_PLATE
                  }}</a>
                </td>
                <td>
                  <span class="text-dark fw-bold d-block fs-7 text-center">{{
                    item.PAYMENT_TYPE
                  }}</span>
                </td>
                <td>
                  <span class="text-dark fw-bold d-block fs-7 text-center">{{
                    new Date(item.PASSAGE_TIME).toLocaleString("en-GB", {
                      timeZone: "UTC",
                    })
                  }}</span>
                </td>
                <td class="text-end">
                  <span class="fs-7 fw-bold text-primary">{{
                    item.CLASS_FARE
                  }}</span>
                </td>
              </tr>
            </tbody>
            <!--end::Table body-->
          </table>
        </div>
        <!--end::Table-->
      </div>
    </div>
    <!--end::Body-->
  </div>
  <!--end::Tables Widget 6-->
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { dashboardStats } from "../../stores/dashboard";
import Loader from "@/layouts/Loader.vue";
const dashboardStore = dashboardStats();

export default defineComponent({
  name: "kt-widget-6",
  components: { Loader },
  props: {
    widgetClasses: String,
  },
  data() {
    return {
      loader: true,
      transaction: <any>[],
      lastTransaction: <any>{},
    };
  },
  computed: {
    getLastFiveTransaction() {
      return dashboardStore.getStatistics;
    },
  },
  watch: {
    getLastFiveTransaction: function () {
      this.transaction = this.getLastFiveTransaction;
      this.lastTransaction = this.transaction.lastFiveTransaction;
      this.loader = false;
    },
  },
});
</script>
