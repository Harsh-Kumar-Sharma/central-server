<template>
  <div class="container">
    <div :class="`page-title d-flex flex-stack flex-wrap mb-5`">
      <h1 class="page-heading d-flex text-dark fw-bold fs-3 flex-column justify-content-center my-0">
        Fare Creation
      </h1>
      <button type="button" class="btn btn-sm btn-primary align-items-end create" data-bs-toggle="modal"
        data-bs-target="#kt_modal_create_vehicle_class">
        <KTIcon icon-name="plus" icon-class="fs-2" />Create New Fare Creation
      </button>
    </div>

    <div :class="widgetClasses" class="card">
      <div class="card-body pt-0">
        <Datatable :data="Fare" :header="fields" :enable-items-per-page-dropdown="true" :checkbox-enabled="false"
          checkbox-label="id">
          <template v-slot:PLAZA_ENTRY="{ row: Fare }">
            {{ Fare.PLAZA_ENTRY }}
          </template>
          <template v-slot:PLAZA_EXIT="{ row: Fare }">
            {{ Fare.PLAZA_EXIT }}
          </template>
          <template v-slot:VEH_CLASS="{ row: Fare }">
            {{ Fare.CLASS_DESCRIPTION }}
          </template>
          <template v-slot:PAY_TYPE="{ row: Fare }">
            {{ Fare.PAY_TYPE }}
          </template>
          <template v-slot:PAY_SUB_TYPE="{ row: Fare }">
            {{ Fare.PAY_SUB_TYPE }}
          </template>
          <template v-slot:TOLL_FARE="{ row: Fare }">
            {{ Fare.TOLL_FARE }}
          </template>
          <template v-slot:OW_FARE="{ row: Fare }">
            {{ Fare.OW_FARE }}
          </template>
          <template v-slot:STATUS="{ row: Fare }">
            {{ Fare.STATUS }}
          </template>
          <template v-slot:IS_ACTIVE="{ row: Fare }">
            {{ Fare.IS_ACTIVE }}
          </template>
          <template v-slot:ACTIVE_DATE="{ row: Fare }">
            {{ Fare.ACTIVE_DATE }}
          </template>
          <template v-slot:ENCODED_DATE="{ row: Fare }">
            {{ Fare.ENCODED_DATE }}
          </template>
          <template v-slot:action="{ row: Fare }">
            <a class="btn btn-sm btn-info" @click="editVehicle(Fare)"><i class="bi bi-pen"></i>
            </a>
          </template>
        </Datatable>
      </div>
    </div>
    <CreateVehicleClassModal></CreateVehicleClassModal>
    <EditVehicleClassModal :fareData="selectedFare" @loadVehicles="allFare"></EditVehicleClassModal>
  </div>
</template>
<script >
import { defineComponent } from "vue";

import Datatable from "@/components/kt-datatable/KTDataTable.vue";
import CreateVehicleClassModal from "@/components/configuration/fare-creation/CreateFareModal.vue";
import EditVehicleClassModal from "@/components/configuration/fare-creation/EditVehicleClassModal.vue";

import axios from "axios";
import { BASE_URL, API_ROUTES } from "@/constants/Config";
export default defineComponent({
  name: "kt-widget-11",
  components: {
    Datatable,
    CreateVehicleClassModal,
    EditVehicleClassModal
  },
  props: {
    widgetClasses: String,
  },

  data() {
    return {
      Fare: [],
      allFare: [],
      selectedFare: {},
      fields: [
        {
          columnName: "Plaza Entry",
          columnLabel: "PLAZA_ENTRY",
          sortEnabled: true,
          columnWidth: 105,
        },
        {
          columnName: "Plaza Exit",
          columnLabel: "PLAZA_EXIT",
          sortEnabled: true,
          columnWidth: 105,
        },
        {
          columnName: "Vehicle Class",
          columnLabel: "VEH_CLASS",
          sortEnabled: true,
          columnWidth: 105,
        },
        {
          columnName: "Payment Type",
          columnLabel: "PAY_TYPE",
          sortEnabled: true,
          columnWidth: 105,
        },
        {
          columnName: "Payment Sub Type",
          columnLabel: "PAY_SUB_TYPE",
          columnWidth: 105,
        },
        {
          columnName: "Toll Fare",
          columnLabel: "TOLL_FARE",
          columnWidth: 105,
        },
        {
          columnName: "Status",
          columnLabel: "STATUS",
          columnWidth: 105,
        },
        {
          columnName: "Active Date",
          columnLabel: "ACTIVE_DATE",
          columnWidth: 175,
        },
        {
          columnName: "Encoded Date",
          columnLabel: "ENCODED_DATE",
          columnWidth: 175,
        },
        {
          columnName: "Edit",
          columnLabel: "action",
          columnWidth: 105,
        },
      ],
    };
  },
  methods: {
    editVehicle(item) {
      this.selectedFare = item;
      window.$("#kt_modal_edit_vehicle").modal("show");
    },
    async getAllVehicle() {
      try {
        const res = await ApiService.get(
          `${API_ROUTES.FARE.GET_FARE}`
        );
        this.allFare = res.data.data;
      } catch (e) {
        swal.fire({
          text: e.response.data.message,
          icon: "error",
          showCancelButton: false,
          showConfirmButton: false,
          timer: 3000,
        });
      }
    },
  },
  mounted() {
    axios.get(`${BASE_URL}${API_ROUTES.FARE.GET_FARE}`).then((res) => {
      this.Fare = res.data.data
    }).catch((error) => {
      console.log(error)
    })
  }
});
</script>
