<template>
  <div class="row">
    <div class="card  border border-2 border-gray-300 border-hover mt-5">
      <div class="card-body">
        <div class="row">
          <div class="col-4">
            <div class="fv-row mb-5 row">
              <!--begin::Label-->
              <div class="col-5">
                <label class="fs-5 fw-semobold form-label mb-5 ">From Date:</label>
              </div>
              <!--end::Label-->
              <div class="col-7">
                <el-date-picker v-model="fromDate" type="datetime" name="eventStartDate"
                  placeholder="Select date and time" class=" w-100" />
              </div>

            </div>

            <div class="fv-row mb-5 row">
              <!--begin::Label-->
              <div class="col-5">
                <label class="fs-5 fw-semobold form-label mb-5">To Date:</label>
              </div>
              <div class="col-7">
                <el-date-picker v-model="toDate" type="datetime" name="eventToDate" placeholder="Select date and time"
                  class="w-100" />
              </div>

              <!--end::Input-->
            </div>

            <div class="fv-row mb-5 row">
              <div class="col-5">
                <!--begin::Label-->
                <label class="fs-5 fw-semobold form-label mb-5">Tag Id</label>
                <!--end::Label-->
              </div>
              <div class="col-7">
                <!--begin::Input-->
                <el-input v-model="tagId" type="text" placeholder="Enter tag id" size="medium" />
                <!--end::Input-->
              </div>
            </div>

            <div class="fv-row mb-5 row">
              <div class="col-5">
                <!--begin::Label-->
                <label class="fs-5 fw-semobold form-label mb-5">Transaction Id</label>
                <!--end::Label-->
              </div>
              <div class="col-7">
                <!--begin::Input-->
                <el-input v-model="transactionId" type="text" placeholder="Enter transaction id" size="medium" />
                <!--end::Input-->
              </div>
            </div>
          </div>
          <div class="col-4">
            <div class="fv-row mb-5 row">
              <div class="col-5">
                <!--begin::Label-->
                <label class="fs-5 fw-semobold form-label mb-5">Plate Number</label>
                <!--end::Label-->
              </div>
              <div class="col-7">
                <!--begin::Input-->
                <el-input v-model="plateNum" type="text" placeholder="Enter plate number" name="eventLocation"
                  size="medium" />
                <!--end::Input-->
              </div>
            </div>

            <div class="fv-row mb-5 row">
              <div class="col-5">
                <!--begin::Label-->
                <label class="fs-5 fw-semobold form-label mb-5">Lane</label>
                <!--end::Label-->
              </div>
              <div class="col-7">
                <el-select v-model="lane" filterable>
                  <el-option key="All" label="All" value="All" />
                  <el-option v-for="item in laneMaster" :key="item.LANE_ID" :label="item.LANE_NAME"
                    :value="item.LANE_NAME" />
                </el-select>
              </div>
            </div>

            <div class="fv-row mb-5 row">
              <div class="col-5">
                <!--begin::Label-->
                <label class="fs-5 fw-semobold form-label mb-5">Vehicle Class</label>
                <!--end::Label-->
              </div>
              <div class="col-7">
                <el-select v-model="vehicleClass" filterable>
                  <el-option key="All" label="All" value="All" />
                  <el-option v-for="item in vehicleClassMaster" :key="item.CLASS_NO" :label="item.CLASS_DESCRIPTION"
                    :value="item.CLASS_NO" />
                </el-select>
              </div>
            </div>

            <div class="fv-row mb-5 row">
              <div class="col-5">
                <!--begin::Label-->
                <label class="fs-5 fw-semobold form-label mb-5">Lane Type</label>
                <!--end::Label-->
              </div>
              <div class="col-7">
                <el-select v-model="selectedLaneType" filterable>
                  <el-option key="All" label="All" value="All" />
                  <el-option v-for="item in laneType" :key="item" :label="item" :value="item" />
                </el-select>
              </div>
            </div>
          </div>
          <div class="col-4">
            <div class="fv-row mb-5 row">
              <div class="col-5">
                <!--begin::Label-->
                <label class="fs-5 fw-semobold form-label mb-5">Payment Type</label>
                <!--end::Label-->
              </div>
              <div class="col-7">
                <el-select v-model="paymentType" filterable>
                  <el-option key="All" label="All" value="All" />
                  <el-option v-for="(item, index) in paymentMaster" :key="index" :label="item.DESCRIPTION" :value="item.PAYMENTTYPE
                    " />
                </el-select>
              </div>
            </div>
            <div class="fv-row mb-5 row">
              <div class="col-5">
                <!--begin::Label-->
                <label class="fs-5 fw-semobold form-label mb-5">Plaza Code</label>
                <!--end::Label-->
              </div>
              <div class="col-7">
                <el-select v-model="plazaCode" filterable>
                  <el-option key="All" label="All" value="All" />
                  <el-option v-for="(item, index) in plazaCodeData" :key="index" :label="item.PLAZA_NAME" :value="item.PLAZA_CODE
                    " />
                </el-select>
              </div>
            </div>
            <div class="row fv-row">
              <div class="text-center row">
                <button type="submit" class="btn btn-light-success mb-2" @click="generateReports">
                  <span class="indicator-label"> Generate Report </span>
                </button>
                <button type="submit" class="btn btn-light-primary" @click="search">
                  <span class="indicator-label"> Search </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="loader">
      <Loader />
    </div>
    <div v-else class="row p-5" style="margin-left:14px">
      <tableDetails />
    </div>
  </div>
</template>
<script>
import { defineComponent } from "vue";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { useMasterData } from "@/stores/common";
import ApiService from "@/core/services/ApiService";
import { API_ROUTES } from "@/constants/Config";
import tableDetails from "./tableDetails.vue";
import { useTmsStore } from "../../stores/report"
import { useAuthStore } from "@/stores/auth";
import Loader from "@/layouts/Loader.vue";
const store = useMasterData();
const reportStore = useTmsStore();
const userAuthStore = useAuthStore();

export default defineComponent({
  name: "Generate Report",
  components: {
    tableDetails,
    Loader,
  },
  data() {
    return {
      fromDate: null,
      toDate: null,
      tagId: "",
      transactionId: "",
      plateNum: "",
      lane: "All",
      vehicleClass: "All",
      selectedLaneType: "All",
      paymentType: "All",
      loading: false,
      laneMaster: store.getMasters.laneMaster,
      vehicleClassMaster: store.getMasters.vehicleClass,
      paymentMaster: store.getMasters.paymentTypeMaster,
      plazaCodeData: store.getMasters.plazaMaster,
      plazaCode: 'All',
      laneType: ["EN", "EX"],
      paymentSubType: 'All',
      loader: false
    };
  },
  computed: {
    getpayload() {
      return reportStore.getpayload;
    },
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
        if (this.fromDate != null && this.toDate != null) {
          if (this.fromDate != null && this.toDate != null) {
            payload.fromDate = this.fromDate
            payload.toDate = this.toDate
            payload.reportsId = [1];
            payload.tagId = this.tagId;
            payload.transactionId = this.transactionId;
            payload.plateNumber = this.plateNum;
            payload.lane = this.lane;
            payload.vehicleClass = this.vehicleClass;
            payload.laneType = this.selectedLaneType;
            payload.paymentType = this.paymentType;
            payload.plazaCode = this.plazaCode;
            payload.loginUser = userAuthStore.user.info.first_name + " " + userAuthStore.user.info.last_name;
          }

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
    async search() {
      try {
        this.loader = true
        const payload = new Object();
        if (this.fromDate != null && this.toDate != null) {
          payload.fromDate = this.fromDate
          payload.toDate = this.toDate
          payload.tagId = this.tagId;
          payload.transactionId = this.transactionId;
          payload.plateNumber = this.plateNum;
          payload.lane = this.lane;
          payload.vehicleClass = this.vehicleClass;
          payload.laneType = this.selectedLaneType;
          payload.paymentType = this.paymentType;
          payload.plazaCode = this.plazaCode;
        }
        await reportStore.setFiltertransactionData(payload, 1)
        this.loader = false;
      }
      catch (e) {
        Swal.fire({
          title: e.response.data.message,
          icon: "error",
          showCancelButton: false,
          showConfirmButton: false,
          timer: 2000,
        });
      }

    }
  },
  mounted() {
    this.fromDate = this.getpayload.fromDate
    this.toDate = this.getpayload.toDate
    this.tagId = this.getpayload.tagId
    this.transactionId = this.getpayload.transactionId
    this.plateNum = this.getpayload.plateNumber
    this.lane = this.getpayload.lane
    this.vehicleClass = this.getpayload.vehicleClass
    this.selectedLaneType = this.getpayload.laneType
    this.paymentType = this.getpayload.paymentType
  }
});
</script>
