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
                                <label class="fs-5 fw-semobold form-label mb-5 ">To Date:</label>
                            </div>
                            <!--end::Label-->
                            <div class="col-7">
                                <el-date-picker v-model="toDate" type="datetime" name="eventStartDate"
                                    placeholder="Select date and time" class=" w-100" />
                            </div>

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
                    </div>
                    <div class="col-4">
                        <div class="fv-row mb-5 row">
                            <div class="col-5">
                                <!--begin::Label-->
                                <label class="fs-5 fw-semobold form-label mb-5">Entry Plaza</label>
                                <!--end::Label-->
                            </div>
                            <div class="col-7">
                                <el-select v-model="entryPlaza" filterable>
                                    <el-option key="All" label="All" value="All" />
                                    <el-option v-for="(item, index) in plazaCodeData" :key="index" :label="item.PLAZA_NAME"
                                        :value="item.PLAZA_CODE
                                            " />
                                </el-select>
                            </div>
                        </div>
                        <div class="fv-row mb-5 row">
                            <div class="col-5">
                                <!--begin::Label-->
                                <label class="fs-5 fw-semobold form-label mb-5">Exit Plaza</label>
                                <!--end::Label-->
                            </div>
                            <div class="col-7">
                                <el-select v-model="exitPlaza" filterable>
                                    <el-option key="All" label="All" value="All" />
                                    <el-option v-for="(item, index) in plazaCodeData" :key="index" :label="item.PLAZA_NAME"
                                        :value="item.PLAZA_CODE
                                            " />
                                </el-select>
                            </div>
                        </div>
                        <div class="fv-row mb-5 row">
                            <div class="col-5">
                                <!--begin::Label-->
                                <label class="fs-5 fw-semobold form-label mb-5">Vehicle Number</label>
                                <!--end::Label-->
                            </div>
                            <div class="col-7">
                                <!--begin::Input-->
                                <el-input v-model="plateNumber" type="text" placeholder="Enter tag id" size="medium" />
                                <!--end::Input-->
                            </div>
                        </div>
                        <div class="row fv-row">
                            <div class="text-center row">
                                <button type="submit" class="btn btn-light-primary" @click="search">
                                    <span class="indicator-label"> Search </span>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="col-4">
                        <div class="fv-row mb-5 row">
                            <div class="col-5">
                                <!--begin::Label-->
                                <label class="fs-5 fw-semobold form-label mb-5">Entry Lane ID</label>
                                <!--end::Label-->
                            </div>
                            <div class="col-7">
                                <el-select v-model="entryLaneId" filterable>
                                    <el-option key="All" label="All" value="All" />
                                    <el-option v-for="item in laneMaster" :key="item.LANE_ID" :label="item.LANE_NAME"
                                        :value="item.LANE_NAME" />
                                </el-select>
                            </div>
                        </div>
                        <div class="fv-row mb-5 row">
                            <div class="col-5">
                                <!--begin::Label-->
                                <label class="fs-5 fw-semobold form-label mb-5">Exit Lane ID</label>
                                <!--end::Label-->
                            </div>
                            <div class="col-7">
                                <el-select v-model="exitLaneId" filterable>
                                    <el-option key="All" label="All" value="All" />
                                    <el-option v-for="item in laneMaster" :key="item.LANE_ID" :label="item.LANE_NAME"
                                        :value="item.LANE_NAME" />
                                </el-select>
                            </div>
                        </div>
                        <div class="fv-row mb-5 row">
                            <div class="col-5">
                                <!--begin::Label-->
                                <label class="fs-5 fw-semobold form-label mb-5">Bank Status</label>
                                <!--end::Label-->
                            </div>
                            <div class="col-7">
                                <el-select v-model="bankStatus" filterable>
                                    <el-option key="All" label="All" value="All" />
                                    <el-option key="1" label="True" value="1" />
                                    <el-option key="0" label="False" value="0" />
                                </el-select>
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
            <tableCard />
        </div>
    </div>
</template>

<script>
import { defineComponent } from "vue";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { useMasterData } from "@/stores/common";
import { API_ROUTES } from "@/constants/Config";
import tableCard from "./tableCard.vue";
import { useTmsStore } from "../../stores/report"
import { useAuthStore } from "@/stores/auth";
import Loader from "@/layouts/Loader.vue";
import axios from "axios";
const store = useMasterData();
const reportStore = useTmsStore();
const userAuthStore = useAuthStore();

export default defineComponent({
    name: "Generate Report",
    components: {
        tableCard,
        Loader,
    },
    data() {
        return {
            fromDate: null,
            toDate: null,
            tagId: "",
            plateNumber: "",
            entryPlaza: "All",
            exitPlaza: "All",
            entryLaneId: "All",
            exitLaneId: "All",
            bankStatus: "All",
            plazaCodeData: store.getMasters.plazaMaster,
            laneMaster: store.getMasters.laneMaster,
            loading: false,
            loader: false
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
                    payload.plateNumber = this.plateNumber;
                    payload.exitLaneId = this.exitLaneId;
                    payload.entryLaneId = this.entryLaneId;
                    payload.exitPlaza = this.exitPlaza;
                    payload.entryPlaza = this.entryPlaza;
                    payload.bankStatus = this.bankStatus;
                }
                await reportStore.setFilterMasterData(payload, 1)
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
    }
});
</script>
