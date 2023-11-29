<template>
  <div :class="`page-title d-flex flex-stack flex-wrap mb-5`">
    <h1 class="page-heading d-flex text-dark fw-bold fs-3 flex-column justify-content-center my-0">
      Lane Creation
    </h1>
    <button type="button" class="btn btn-sm btn-primary align-items-end create" data-bs-toggle="modal"
      data-bs-target="#kt_modal_create_lane">
      <KTIcon icon-name="plus" icon-class="fs-2" />Create New Lane
    </button>
  </div>

  <div :class="widgetClasses" class="card">
    <div class="card-body pt-0">
      <Datatable :data="allLanes" :header="fields" :enable-items-per-page-dropdown="true" :checkbox-enabled="false"
        checkbox-label="id">
        <template v-slot:LANE_NAME="{ row: allLanes }">
          {{ allLanes.LANE_NAME }}
        </template>
        <template v-slot:LANE_TYPE="{ row: allLanes }">
          {{ allLanes.LANE_TYPE }}
        </template>
        <template v-slot:LANE_IP="{ row: allLanes }">
          {{ allLanes.LANE_IP }}
        </template>
        <template v-slot:LANE_DIR="{ row: allLanes }">
          {{ allLanes.LANE_DIR }}
        </template>
        <template v-slot:STATUS="{ row: allLanes }">
          {{ allLanes.STATUS }}
        </template>
        <template v-slot:CREATED_AT="{ row: allLanes }">
          {{ allLanes.CREATED_AT }}
        </template>
        <template v-slot:action="{ row: allLanes }">
          <a class="btn btn-sm btn-info" @click="editLane(allLanes)"><i class="bi bi-pen"></i>
          </a>
        </template>
      </Datatable>
    </div>
  </div>
  <CreateLaneModal />
  <EditLaneModal :laneData="selectedLane" />
</template>
<script lang="ts">
import { defineComponent } from "vue";
import axios from "axios";
import { API_ROUTES, BASE_URL } from "@/constants/Config";
import Datatable from "@/components/kt-datatable/KTDataTable.vue";
import CreateLaneModal from "@/components/configuration/lane-creation/CreateLaneModal.vue";
import EditLaneModal from "@/components/configuration/lane-creation/EditLaneModal.vue";

export default defineComponent({
  name: "kt-widget-11",
  components: {
    CreateLaneModal,
    Datatable,
    EditLaneModal,
  },
  props: {
    widgetClasses: String,
  },
  data() {
    return {
      allLanes: [],
      selectedLane: {},
      fields: [
        {
          columnName: "Lane No",
          columnLabel: "LANE_NAME",
          sortEnabled: true,
          columnWidth: 150,
        },
        {
          columnName: "Lane Type",
          columnLabel: "LANE_TYPE",
          sortEnabled: true,
          columnWidth: 150,
        },
        {
          columnName: "Lane IP",
          columnLabel: "LANE_IP",
          sortEnabled: true,
          columnWidth: 150,
        },
        {
          columnName: "Direction",
          columnLabel: "LANE_DIR",
          sortEnabled: true,
          columnWidth: 150,
        },
        {
          columnName: "Status",
          columnLabel: "STATUS",
          sortEnabled: true,
          columnWidth: 150,
        },
        {
          columnName: "Date",
          columnLabel: "CREATED_AT",
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
    editLane(item) {
      this.selectedLane = item;
      (window as any).$("#kt_modal_edit_lane").modal("show");
    },
  },

  async mounted() {
    const res = await axios.get(`${BASE_URL}${API_ROUTES.LANE.GET_ALL_LANES}`);

    this.allLanes = res.data.data;
  },
});
</script>
