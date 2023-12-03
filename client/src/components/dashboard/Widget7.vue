<template>
    <!--begin::Mixed Widget 14-->
    <div :class="widgetClasses" class="card theme-dark-bg-body" :style="`background-color: ${widgetColor}`"
        style="height:80px;">
        <div class="card-body d-flex flex-column">
            <div class="row">
                <div class="col-4">
                    <div class="row text-center">
                        <div class="col-4">
                            <label class="fs-5 fw-semobold form-label mb-5 ">From Date:</label>
                        </div>
                        <div class="col-8">
                            <el-date-picker v-model="fromDate" type="datetime" name="eventStartDate"
                                placeholder="Select date and time" class=" w-100" />
                        </div>
                    </div>
                </div>
                <div class="col-4">
                    <div class="row text-center">
                        <div class="col-4">
                            <label class="fs-5 fw-semobold form-label mb-5 ">To Date:</label>
                        </div>
                        <div class="col-8">
                            <el-date-picker v-model="toDate" type="datetime" name="eventToDate"
                                placeholder="Select date and time" class="w-100" />
                        </div>
                    </div>
                </div>
                <div class="col-4 mb-4">
                    <div class="row fv-row">
                        <div class="row">
                            <button type="submit" class="btn btn-light-primary" @click="search">
                                <span class="indicator-label"> Search </span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!--end::Mixed Widget 14-->
</template>

  
<script lang="ts">
import { defineComponent } from "vue";
import { dashboardStats } from "../../stores/dashboard";
import Loader from "@/layouts/Loader.vue";
import { useThemeStore } from "../../stores/theme";
import Swal from "sweetalert2";
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
            loader: false,
            themeStore: useThemeStore(),
            data: <any>[],
            fromDate: '',
            toDate: ''
        }
    },
    methods: {
        async search() {
            try {
                this.themeStore.setLoader(true);
                const from = new Date(this.fromDate);
                const to = new Date(this.toDate);
                const f1 = from.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
                const t1 = to.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
                const payload = { fromDate: f1, toDate: t1 }
                await dashboardStore.getStatisticsData(payload);
                this.themeStore.setLoader(false);
            } catch (e: any) {
                Swal.fire({
                    title: "Ooops! Something went wrong",
                    text: `Failed to get data from the server: ${e.response ? e.response.data.message : e
                        }`,
                    icon: "error",
                    showConfirmButton: false,
                    showCancelButton: false,
                    timer: 3000,
                });
                this.themeStore.setLoader(false);
            }
        },
    }
});
</script>
