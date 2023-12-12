<template>
  <!--begin::List Widget 1-->

  <div class="card h-md-100 border border-2 border-gray-300 border-hover">
    <div class="card-header border-0 pt-2">
      <h4 class="card-title align-items-start flex-column">
        <span class="card-label">Generate Reports</span>
      </h4>
    </div>

    <div class="card-body">
      <div class="row mb-5">
        <!--begin::Button-->
        <Widget3 class="mx-2"></Widget3>
        <!--end::Button-->
      </div>

      <hr />

      <div class="fv-row mb-5">
        <!--begin::Label-->
        <label class="fs-5 fw-semobold form-label mb-5">From:</label>
        <!--end::Label-->

        <!--begin::Input-->
        <el-date-picker
          v-model="fromDate"
          type="datetime"
          :teleported="false"
          name="eventStartDate"
          placeholder="Select date and time"
          class="mx-5"
          @change="resetDuration"
        />
        <!--end::Input-->
      </div>

      <div class="fv-row mb-5">
        <!--begin::Label-->
        <label class="fs-5 fw-semobold form-label mb-5">To:</label>
        <!--end::Label-->

        <!--begin::Input-->
        <el-date-picker
          v-model="toDate"
          type="datetime"
          :teleported="false"
          name="eventToDate"
          placeholder="Select date and time"
          class="mx-11"
          @change="resetDuration"
        />
        <!--end::Input-->
      </div>
      <div class="text-center">
        <p>Or</p>
      </div>
      <div class="row fv-row">
        <!--begin::Label-->

        <label class="fs-5 fw-semobold form-label mb-5">Duration:</label>

        <!--end::Label-->

        <!--begin::Radio group-->

        <div class="d-flex flex-column">
          <el-radio
            label="Today"
            v-model="duration"
            @change="resetDateRange"
          ></el-radio>

          <el-radio
            label="Yesterday"
            v-model="duration"
            @change="resetDateRange"
          ></el-radio>

          <el-radio
            label="This Week"
            v-model="duration"
            @change="resetDateRange"
          ></el-radio>

          <el-radio
            label="This Month"
            v-model="duration"
            @change="resetDateRange"
          ></el-radio>
        </div>
        <!--end::Input group-->

        <div class="separator separator-dotted my-2 mb-5"></div>

        <!--end::Menu separator-->
        <div>
          <label class="fs-5 fw-semobold form-label mb-5"
            >Select Reports:
          </label>

          <el-select
            v-model="reports"
            multiple
            filterable
            placeholder="Select Reports"
            class="mx-5"
          >
            <el-option
              v-for="item in allReport"
              :key="item.id"
              :label="item.report_name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </div>

        <div class="text-center row mt-8">
          <!--begin::Button-->

          <button
            :data-kt-indicator="loading ? 'on' : null"
            type="submit"
            class="btn btn-lg btn-light-primary"
            @click="generateReports"
          >
            <span class="indicator-label"> Generate Reports </span>
          </button>
          <!--end::Button-->
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { defineComponent } from "vue";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { useMasterData } from "@/stores/common";
import ApiService from "@/core/services/ApiService";
import { API_ROUTES } from "@/constants/Config";
import Widget3 from "@/components/tms-report/Widget3.vue";

export default defineComponent({
  name: "Generate Report",

  components: {
    Widget3,
  },
  data() {
    return {
      duration: "",
      fromDate: null,
      toDate: null,
      reports: [],
      allReport: {},
      loading: false,
    };
  },
  methods: {
    async generateReports() {
      Swal.fire({
        title: "Report is generating...",
        icon: "success",
        showCancelButton: false,
        showConfirmButton: false,
        timer: 3000,
      });

      const payload = new Object();
      try {
        if (
          this.reports.length > 0 &&
          ((this.fromDate != null && this.toDate != null) || this.duration)
        ) {
          if (this.fromDate != null && this.toDate != null) {
            payload.fromDate = new Date(this.fromDate).toLocaleString();
            payload.toDate = new Date(this.toDate).toLocaleString();
          }
          if (this.duration) {
            payload.duration = this.duration;
          }
          payload.reportsId = this.reports;

          await ApiService.post(`${API_ROUTES.TMS_REPORT.GENERATE_REPORTS}`, {
            ...payload,
          });
        } else {
          Swal.fire({
            title: "Please select valid filter!",
            icon: "warning",
            showCancelButton: false,
            showConfirmButton: false,
            timer: 2000,
          });
        }
      } catch (e) {
        Swal.fire({
          title: e.response.data.message,
          icon: "error",
          showCancelButton: false,
          showConfirmButton: false,
          timer: 2000,
        });
      }
    },
    reportData() {
      const store = useMasterData();
      this.allReport = store.masterData.reportMaster;
    },
    resetDuration() {
      this.duration = null;
    },
    resetDateRange() {
      this.fromDate = null;
      this.toDate = null;
    },
  },
  mounted() {
    return this.reportData();
  },
});
</script>
