<template>
    <div :class="`page-title d-flex flex-stack flex-wrap mb-5`">
        <h1 class="page-heading d-flex text-dark fw-bold fs-3 flex-column justify-content-center my-0">
            Lane Device Config
        </h1>
        <button type="button" class="btn btn-sm btn-primary align-items-end create" data-bs-toggle="modal"
            data-bs-target="#kt_modal_create_lane_device">
            <KTIcon icon-name="plus" icon-class="fs-2" />Create New Lane Device
        </button>
    </div>

    <div :class="widgetClasses" class="card">
        <div class="card-body pt-0">
            <Datatable :data="LaneDevice" :header="fields" :enable-items-per-page-dropdown="true" :checkbox-enabled="false"
                checkbox-label="id">
                <template v-slot:lane_no="{ row: LaneDevice }">
                    {{ LaneDevice.LANE_ID }}
                </template>
                <template v-slot:device_name="{ row: LaneDevice }">
                    {{ LaneDevice.DEVICE_NAME }}
                </template>
                <template v-slot:device_ip="{ row: LaneDevice }">
                    {{ LaneDevice.DEVICE_IP }}
                </template>
                <template v-slot:url="{ row: LaneDevice }">
                    {{ LaneDevice.DEVICE_URL }}
                </template>
                <template v-slot:action="{ row: LaneDevice }">
                    <a class="btn btn-sm btn-info" @click="editLaneDevice(LaneDevice)"><i class="bi bi-pen"></i>
                    </a>
                </template>
            </Datatable>
            <LaneDeviceConfigModal />
            <EditLaneDeviceConfigModal :deviceData="selectedDevice" />
        </div>
    </div>
</template>
<script>
import { defineComponent } from "vue";
import axios from "axios";
import { BASE_URL, API_ROUTES } from "@/constants/Config"
import LaneDeviceConfigModal from "@/components/configuration/laneDeviceConfig/LaneDeviceConfigModal.vue"
import Datatable from "@/components/kt-datatable/KTDataTable.vue";
import EditLaneDeviceConfigModal from "@/components/configuration/laneDeviceConfig/EditLaneDeviceConfigModal.vue";


export default defineComponent({
    name: "kt-widget-11",
    components: {
        Datatable,
        LaneDeviceConfigModal,
        EditLaneDeviceConfigModal
    },
    props: {
        widgetClasses: String,
    },

    data() {
        return {
            LaneDevice: [],
            selectedDevice: {},
            fields: [
                {
                    columnName: "Lane No",
                    columnLabel: "lane_no",
                    sortEnabled: true,
                    columnWidth: 150,
                },
                {
                    columnName: "Device Name",
                    columnLabel: "device_name",
                    sortEnabled: true,
                    columnWidth: 150,
                },
                {
                    columnName: "Device IP",
                    columnLabel: "device_ip",
                    sortEnabled: true,
                    columnWidth: 150,
                },
                {
                    columnName: "URL",
                    columnLabel: "url",
                    sortEnabled: true,
                    columnWidth: 150,
                },
                {
                    columnName: "Action",
                    columnLabel: "action",
                    columnWidth: 175,
                },
            ],
        };
    },
    methods: {
        editLaneDevice(item) {
            this.selectedDevice = item;
            $("#kt_modal_edit_lane_device").modal("show");
        }
    },
    async mounted() {
        const res = await axios.get(`${BASE_URL}${API_ROUTES.DEVICE.GET_ALL_DEVICES}`)
        this.LaneDevice = res.data.data
        console.log(res.data.data)
    }
});
</script>
  