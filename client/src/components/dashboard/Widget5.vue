<template>
  <!--begin::Mixed Widget 14-->
  <div
    :class="widgetClasses"
    class="card theme-dark-bg-body"
    :style="`background-color: ${widgetColor}`"
    style="height: 500px"
  >
    <!--begin::Body-->
    <div class="card-body d-flex flex-column">
      <div class="d-flex flex-column mb-7">
        <!--begin::Title-->
        <h3 class="card-title fw-bold text-dark">Users & Shifts</h3>
        <!--end::Title-->
      </div>
      <div v-if="loader">
        <Loader />
      </div>
      <div v-else>
        <div class="row m-0 pt-5">
          <div class="col-12 bg-light-primary px-6 py-8 rounded-2 me-7 mb-7">
            <div>
              <KTIcon
                icon-name="abstract-26"
                :icon-class="`text-primary fs-1 me-5`"
              />
            </div>
            <a class="text-dark fw-bold fs-3">Total Users</a>
            <a class="text-dark fw-bold fs-2 float-end">{{
              usersShift.totalUsers
            }}</a>
          </div>
          <div class="col-12 bg-light-danger px-6 py-8 rounded-2 me-7 mb-7">
            <div>
              <KTIcon icon-name="time" :icon-class="`text-danger fs-1 me-5`" />
            </div>
            <a class="text-dark fw-bold fs-3">Shifts</a>
            <a class="text-dark fw-bold fs-2 float-end">{{
              usersShift.totalShift
            }}</a>
          </div>
        </div>
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
      data: <any>[],
      usersShift: <any>[],
    };
  },
  computed: {
    getUsersShift() {
      return dashboardStore.getStatistics;
    },
  },
  watch: {
    getUsersShift: function () {
      this.data = this.getUsersShift;
      this.usersShift = this.data.userAndShiftInformation;
      this.loader = false;
    },
  },
});
</script>
