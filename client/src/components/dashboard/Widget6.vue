<template>
  <!--begin::Card-->
  <div
    class="card card-flush mb-0"
    :class="widgetClasses"
    style="height: 500px"
  >
    <!--begin::Card header-->
    <div class="card-header">
      <!--begin::Card title-->
      <div class="card-title">
        <h3>System Health</h3>
      </div>
      <!--end::Card title-->
    </div>
    <!--end::Card header-->
    <div v-if="loader"><Loader /></div>
    <!--begin::Card body-->
    <div class="card-body pt-2 fs-6" v-else>
      <!--begin::Details-->
      <div class="d-flex flex-row pt-1">
        <span class="fw-bold text-gray-800">CPU: </span>

        <div class="table">
          <table class="table ms-5">
            <tbody>
              <tr>
                <td><span class="fs-7">Brand: </span></td>
                <td>
                  <a class="fw-semobold text-gray-600 fs-7">{{
                    systemData.Cpu?.brand
                  }}</a>
                </td>
              </tr>
              <tr>
                <td><span class="fs-7">Performance Core:</span></td>
                <td>
                  <a class="fw-semobold text-gray-600 fs-7">{{
                    systemData.Cpu?.performanceCores
                  }}</a>
                </td>
              </tr>
              <tr>
                <td><span class="fs-7">Physical Core:</span></td>
                <td>
                  <a class="fw-semobold text-gray-600 fs-7">{{
                    systemData.Cpu?.physicalCores
                  }}</a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <!--end::Details-->

      <!--begin::Seperator-->
      <div class="separator separator-dashed"></div>
      <!--end::Seperator-->

      <!--begin::Details-->
      <div class="d-flex flex-row pt-1">
        <span class="fw-bold text-gray-800">Memory: </span>

        <div class="table">
          <table class="table ms-5">
            <tbody>
              <tr>
                <td><span class="fs-7">Total: </span></td>
                <td>
                  <a class="fw-semobold text-gray-600 fs-7"
                    >{{ totalMemory }} GB</a
                  >
                </td>
              </tr>
              <tr>
                <td><span class="fs-7">Used:</span></td>
                <td>
                  <a class="fw-semobold text-gray-600 fs-7"
                    >{{ usedMemory }} GB</a
                  >
                </td>
              </tr>
              <tr>
                <td><span class="fs-7">Available:</span></td>
                <td>
                  <a class="fw-semobold text-gray-600 fs-7"
                    >{{ availableMemory }} GB</a
                  >
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <!--end::Details-->

      <!--begin::Seperator-->
      <div class="separator separator-dashed"></div>
      <!--end::Seperator-->

      <!--begin::Details-->
      <div class="d-flex flex-row pt-1">
        <span class="fw-bold text-gray-800">Processor: </span>

        <div class="table">
          <table class="table ms-5">
            <tbody>
              <tr>
                <td><span class="fs-7"> Current Load</span></td>
                <td>
                  <a class="fw-semobold text-gray-600 fs-7">{{
                    systemData.ProcesserLoad?.currentLoad
                  }}</a>
                </td>
              </tr>
              <tr>
                <td><span class="fs-7">RCurrent Load:</span></td>
                <td>
                  <a class="fw-semobold text-gray-600 fs-7">{{
                    systemData.ProcesserLoad?.rawCurrentLoad
                  }}</a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <!--end::Details-->

      <div class="separator separator-dashed"></div>

      <!-- <div class="d-flex flex-row pt-1">
        <span class="fw-bold text-gray-800">Network: </span>

        <div class="table">
          <table class="table ms-5">
            <tbody v-for="item of systemData.Network" :key="item.id">
              <tr>
                <td>
                  <span class="fs-7"> {{ item.iface }}</span>
                </td>
                <td>
                  <a class="fw-semobold text-gray-600 fs-7">{{
                    item.ifaceName
                  }}</a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div> -->
    </div>

    <!--end::Card body-->
  </div>
  <!--end::Card-->
</template>

<script lang="ts">
import { getAssetPath } from "@/core/helpers/assets";
import { defineComponent } from "vue";
import { dashboardStats } from "../../stores/dashboard";
import Loader from "@/layouts/Loader.vue";
const dashboardStore = dashboardStats();

export default defineComponent({
  name: "kt-summary",
  components: { Loader },
  props: {
    widgetClasses: String,
  },
  data() {
    return {
      data: <any>[],
      systemData: <any>[],
      loader: true,
      totalMemory: <any>null,
      usedMemory: <any>null,
      availableMemory: <any>null,
    };
  },
  computed: {
    getSystemHealth() {
      return dashboardStore.getStatistics;
    },
  },
  watch: {
    getSystemHealth: function () {
      this.data = this.getSystemHealth;
      this.systemData = this.data.systemInformation;

      this.totalMemory = Math.floor(this.systemData.Memory.total / 1000000000);
      this.usedMemory = Math.floor(this.systemData.Memory.used / 1000000000);
      this.availableMemory = Math.floor(
        this.systemData.Memory.available / 1000000000
      );
      this.loader = false;
    },
  },
});
</script>
