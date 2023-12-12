<template>
  <button
    id="toggle-filter"
    class="filter btn btn-light-danger lh-1"
    data-bs-toggle="tooltip"
    data-bs-placement="left"
    data-bs-dismiss="click"
    data-bs-trigger="hover"
  >
    <i class="bi bi-clipboard2-check"></i>Custom Report
  </button>

  <div
    id="kt_modal_filter"
    ref="addDeviceModalRef"
    class="bg-body drawer drawer-end"
    data-kt-drawer="true"
    data-kt-drawer-name="app-settings"
    data-kt-drawer-activate="true"
    data-kt-drawer-overlay="true"
    data-kt-drawer-width="{default:'550px', 'lg': '550px'}"
    data-kt-drawer-direction="end"
    data-kt-drawer-toggle="#toggle-filter"
    data-kt-drawer-close="#kt_app_layout_builder_close"
  >
    <!--begin::Card-->

    <div class="card border-0 shadow-none rounded-0 w-100">
      <!--begin::Card header-->

      <div
        class="card-header bgi-position-y-bottom bgi-position-x-end bgi-size-cover bgi-no-repeat rounded-0 border-0 py-3"
        id="kt_app_layout_builder_header"
        :style="{
          backgroundImage: `url(
  
              ${getAssetPath('media/misc/layout/customizer-header-bg.jpg')}
  
            )`,
        }"
      >
        <!--begin::Card title-->

        <h3 class="card-title fs-3 fw-bold text-white flex-column m-0">
          Filter
        </h3>

        <!--end::Card title-->

        <!--begin::Card toolbar-->

        <div class="card-toolbar">
          <button
            type="button"
            class="btn btn-sm btn-icon bg-white bg-opacity-25 btn-color-white p-0 w-20px h-20px rounded-1"
            id="kt_app_layout_builder_close"
          >
            <KTIcon icon-name="cross-square" icon-class="fs-3" />
          </button>
        </div>

        <!--end::Card toolbar-->
      </div>

      <!--end::Card header-->

      <!--begin::Card body-->

      <div class="card-body position-relative" id="kt_app_layout_builder_body">
        <div
          id="kt_app_settings_content"
          class="position-relative scroll-y me-n5 pe-5"
          data-kt-scroll="true"
          data-kt-scroll-height="auto"
          data-kt-scroll-wrappers="#kt_app_layout_builder_body"
          data-kt-scroll-dependencies="#kt_app_layout_builder_header, #kt_app_layout_builder_footer"
          data-kt-scroll-offset="5px"
        >
          <!--begin::Form-->

          <form class="form" id="kt_app_layout_builder_form">
            <!--begin::Form group-->

            <div class="form-group">
              <!--begin::Options-->

              <div class="row g-9">
                <div class="col-6 fv-row">
                  <!--begin::Label-->
                  <label class="fs-6 fw-semobold mb-1">From</label>
                  <!--end::Label-->

                  <!--begin::Input-->
                  <el-date-picker
                    v-model="formData.fromDate"
                    type="datetime"
                    :teleported="false"
                    name="eventStartDate"
                    placeholder="Select date and time"
                  />
                  <!--end::Input-->
                </div>

                <div class="col-6 fv-row">
                  <!--begin::Label-->
                  <label class="fs-6 fw-semobold mb-1">To</label>
                  <!--end::Label-->

                  <!--begin::Input-->
                  <el-date-picker
                    v-model="formData.toDate"
                    type="datetime"
                    :teleported="false"
                    name="eventStartDate"
                    placeholder="Select date and time"
                  />
                  <!--end::Input-->
                </div>
              </div>

              <div class="row g-9 mt-1">
                <div class="col-md-6 fv-row">
                  <!--begin::Label-->
                  <label class="fs-6 fw-semobold mb-1">Tag ID</label>
                  <!--end::Label-->

                  <!--begin::Input-->
                  <el-input
                    v-model="formData.tagId"
                    type="text"
                    placeholder="Enter tag id"
                    name="eventLocation"
                  />
                  <!--end::Input-->
                </div>
                <div class="col-md-6 fv-row">
                  <!--begin::Label-->
                  <label class="fs-6 fw-semobold mb-1">Transaction ID</label>
                  <!--end::Label-->

                  <!--begin::Input-->
                  <el-input
                    v-model="formData.transactionId"
                    type="text"
                    placeholder="Enter transaction id"
                    name="eventLocation"
                  />
                  <!--end::Input-->
                </div>
              </div>

              <div class="row g-9 mt-1">
                <div class="col-md-6 fv-row">
                  <!--begin::Label-->
                  <label class="fs-6 fw-semobold mb-1">Plate Number</label>
                  <!--end::Label-->

                  <!--begin::Input-->
                  <el-input
                    v-model="formData.plateNumber"
                    type="text"
                    placeholder="Enter plate number"
                    name="eventLocation"
                  />
                  <!--end::Input-->
                </div>
                <div class="col-md-6 fv-row">
                  <!--begin::Label-->
                  <label class="fs-6 fw-semobold mb-1">Lane Type</label>
                  <!--end::Label-->

                  <el-select v-model="formData.laneType" placeholder="Select">
                    <el-option
                      v-for="item in laneType"
                      :key="item"
                      :label="item"
                      :value="item"
                    />
                  </el-select>
                </div>
              </div>

              <div class="row g-9 mt-1">
                <div class="col-md-6 fv-row">
                  <!--begin::Label-->
                  <label class="fs-6 fw-semobold mb-1">Lane</label>
                  <!--end::Label-->

                  <el-select v-model="formData.lane" placeholder="Select">
                    <el-option
                      v-for="item in laneMaster"
                      :key="item.LANE_ID"
                      :label="item.LANE_NAME"
                      :value="item.LANE_NAME"
                    />
                  </el-select>
                </div>

                <div class="col-md-6 fv-row">
                  <!--begin::Label-->
                  <label class="fs-6 fw-semobold mb-1">Vehicle Class</label>
                  <!--end::Label-->

                  <el-select
                    v-model="formData.vehicleClass"
                    placeholder="Select"
                  >
                    <el-option
                      v-for="item in vehicleClassMaster"
                      :key="item.CLASS_DESCRIPTION"
                      :label="item.CLASS_DESCRIPTION"
                      :value="item.CLASS_DESCRIPTION"
                    />
                  </el-select>
                </div>
              </div>

              <div class="row g-9 mt-1 mb-1">
                <div class="col-md-6 fv-row">
                  <!--begin::Label-->
                  <label class="fs-6 fw-semobold mb-1">Payment Type</label>
                  <!--end::Label-->

                  <el-select
                    v-model="formData.paymentType"
                    placeholder="Select"
                  >
                    <el-option
                      v-for="item in paymentMaster"
                      :key="item.ID"
                      :label="item.DESCRIPTION"
                      :value="item.PAYMENTTYPE"
                    />
                  </el-select>
                </div>

                <div class="col-md-6 fv-row">
                  <!--begin::Label-->
                  <label class="fs-6 fw-semobold mb-1">Abnormality</label>
                  <!--end::Label-->

                  <el-select
                    v-model="formData.abnormality"
                    placeholder="Select"
                  >
                    <el-option
                      v-for="item in abnormality"
                      :key="item"
                      :label="item"
                      :value="item"
                    />
                  </el-select>
                </div>
              </div>

              <div class="row g-9 mt-1 mb-1">
                <div class="col-md-6 fv-row">
                  <!--begin::Label-->
                  <label class="fs-6 fw-semobold mb-1">Report Type</label>
                  <!--end::Label-->

                  <el-select
                    v-model="formData.reportsId"
                    placeholder="Select"
                    multiple
                    filterable
                  >
                    <el-option
                      v-for="item in reportMaster"
                      :key="item.id"
                      :label="item.report_name"
                      :value="item.id"
                    />
                  </el-select>
                </div>
              </div>
              <!--end::Options-->
            </div>
          </form>
          <!--end::Form-->
        </div>
      </div>
      <!--end::Card body-->

      <!--begin::Card footer-->
      <div
        class="card-footer border-0 d-flex"
        id="kt_app_layout_builder_footer"
      >
        <button
          type="button"
          class="btn btn-primary flex-grow-1 fw-semibold mx-3"
          @click="generateCustomReport"
        >
          <!--begin::Indicator label-->

          <span class="indicator-label">Generate Report</span>

          <!--end::Indicator label-->
        </button>

        <button
          @click="reset(false)"
          type="button"
          class="btn btn-light flex-grow-1 fw-semibold"
        >
          <!--begin::Indicator label-->

          <span class="indicator-label">Reset</span>

          <!--end::Indicator label-->

          <!--begin::Indicator progress-->

          <span class="indicator-progress"
            >Please wait...

            <span
              class="spinner-border spinner-border-sm align-middle ms-2"
            ></span
          ></span>

          <!--end::Indicator progress-->
        </button>
      </div>
      <!--end::Card footer-->
    </div>

    <!--end::Card-->
  </div>
</template>

<script lang="ts">
import { getAssetPath } from "@/core/helpers/assets";
import { defineComponent, ref, onMounted } from "vue";
import { config, layout, themeMode } from "@/core/helpers/config";
import { LS_CONFIG_NAME_KEY, useConfigStore } from "@/stores/config";
import { useThemeStore } from "@/stores/theme";
import { useMasterData } from "@/stores/common";
const masterStore = useMasterData() as any;
import { useTransactionStore } from "@/stores/transaction";
const transactionStore = useTransactionStore();
import ApiService from "@/core/services/ApiService";
import { API_ROUTES } from "@/constants/Config";

export default defineComponent({
  name: "customize-layout",
  components: {},
  props: { payData: Object },
  setup(props, { emit }) {
    const storeConfig = useConfigStore();
    const storeTheme = useThemeStore();
    const filter = ref<null | HTMLElement>(null);
    const addDeviceModalRef = ref<null | HTMLElement>(null);
    const layoutType = ref(layout.value);
    const laneMaster = masterStore.getMasters.laneMaster;
    const vehicleClassMaster = masterStore.getMasters.vehicleClass;
    const paymentMaster = masterStore.getMasters.paymentTypeMaster;
    const reportMaster = masterStore.getMasters.reportMaster;
    const laneType = ref<string[]>(["EN", "EX"]);
    const abnormality = ref<string[]>(["OK", "NOT OK"]);
    let filterStatus = ref() as any;

    const formData = ref({
      vehicleClass: "",
      paymentType: "",
      lane: "",
      tagId: "",
      laneType: "",
      plateNumber: "",
      transactionId: "",
      toDate: <any>null,
      fromDate: <any>null,
      abnormality: "",
      reportsId: null,
    });
    const oldFormData = ref({
      vehicleClass: "",
      paymentType: "",
      lane: "",
      tagId: "",
      laneType: "",
      plateNumber: "",
      transactionId: "",
      toDate: null,
      fromDate: null,
      abnormality: "",
      reportsId: null,
    });

    const reset = async (status) => {
      formData.value.vehicleClass = "";
      formData.value.paymentType = "";
      formData.value.lane = "";
      formData.value.tagId = "";
      formData.value.laneType = "";
      formData.value.plateNumber = "";
      formData.value.transactionId = "";
      formData.value.toDate = null;
      formData.value.fromDate = null;
      formData.value.abnormality = "";
      formData.value.reportsId = null;
    };

    const generateCustomReport = async () => {
      if (formData.value.fromDate === null && formData.value.toDate === null) {
        formData.value.fromDate = "";
        formData.value.toDate = "";
      }
      const reportFilterData = {
        vehicleClass: formData.value.vehicleClass,
        paymentType: formData.value.paymentType,
        lane: formData.value.lane,
        tagId: formData.value.tagId,
        laneType: formData.value.laneType,
        plateNumber: formData.value.plateNumber,
        transactionId: formData.value.transactionId,
        toDate: formData.value.toDate,
        fromDate: formData.value.fromDate,
        abnormality: formData.value.abnormality,
        reportsId: formData.value.reportsId,
      };

      await ApiService.post(`${API_ROUTES.TMS_REPORT.GENERATE_REPORTS}`, {
        ...reportFilterData,
      });

      console.log(reportFilterData);
    };

    const onThemeModeChange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      storeConfig.setLayoutConfigProperty("general.mode", target.value);
      storeTheme.setThemeMode(target.value as "dark" | "light" | "system");
      // save new config to localStorage
      localStorage.setItem(LS_CONFIG_NAME_KEY, JSON.stringify(config.value));
    };

    return {
      reset,
      onThemeModeChange,
      config,
      layoutType,
      themeMode,
      getAssetPath,
      formData,
      filter,
      addDeviceModalRef,
      laneType,
      laneMaster,
      vehicleClassMaster,
      paymentMaster,
      reportMaster,
      abnormality,
      filterStatus,
      oldFormData,
      generateCustomReport,
    };
  },
});
</script>
