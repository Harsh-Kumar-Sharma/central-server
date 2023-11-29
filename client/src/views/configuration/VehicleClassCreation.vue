<template>
  <div class="container">
    <div :class="`page-title d-flex flex-stack flex-wrap mb-5`">
      <h1 class="page-heading d-flex text-dark fw-bold fs-3 flex-column justify-content-center my-0">
        Vehicle Class Creation
      </h1>
      <button type="button" class="btn btn-sm btn-primary align-items-end create" data-bs-toggle="modal"
        data-bs-target="#kt_modal_create_vehicle_class">
        <KTIcon icon-name="plus" icon-class="fs-2" />Create New Vehicle Class
      </button>
    </div>

    <div :class="widgetClasses" class="card">
      <div class="card-body pt-0">
        <Datatable :data="allVehicle" :header="fields" :enable-items-per-page-dropdown="true" :checkbox-enabled="false"
          checkbox-label="id">
          <template v-slot:CLASS_NO="{ row: allVehicle }">
            {{ allVehicle.CLASS_NO }}
          </template>
          <template v-slot:description="{ row: allVehicle }">
            {{ allVehicle.CLASS_DESCRIPTION }}
          </template>
          <template v-slot:selection_key="{ row: allVehicle }">
            {{ allVehicle.SEL_KEY }}
          </template>
          <template v-slot:status="{ row: allVehicle }">
            {{ allVehicle.CLASS_STATUS }}
          </template>

          <template v-slot:date="{ row: allVehicle }">
            {{
              new Date(allVehicle.ENCODED_DATE).toLocaleString("en-GB", {
                timeZone: "UTC",
              })
            }}
          </template>
          <template v-slot:action="{ row: allVehicle }">
            <a class="btn btn-sm btn-info" @click="editVehicle(allVehicle)"><i class="bi bi-pen"></i>
            </a>
            <a class="btn btn-sm btn-danger mx-2" @click="deleteVehicle(allVehicle.CLASS_NO)"><i class="bi bi-trash"></i>
            </a></template>
        </Datatable>
      </div>
    </div>
    <CreateVehicleClassModal></CreateVehicleClassModal>
    <EditVehicleClassModal :vehicleData="selectedVehicle" @loadVehicles="getAllVehicle"></EditVehicleClassModal>
  </div>
</template>
<script>
import { defineComponent } from "vue";
import Datatable from "@/components/kt-datatable/KTDataTable.vue";
import CreateVehicleClassModal from "@/components/configuration/vehicle-class-creation/CreateVehicleClassModal.vue";
import EditVehicleClassModal from "@/components/configuration/vehicle-class-creation/EditVehicleClassModal.vue";
import ApiService from "@/core/services/ApiService";
import { API_ROUTES } from "@/constants/Config";
import swal from "sweetalert2";

export default defineComponent({
  name: "kt-widget-11",
  components: {
    Datatable,
    CreateVehicleClassModal,
    EditVehicleClassModal,
  },
  props: {
    widgetClasses: String,
  },

  data() {
    return {
      allVehicle: [],
      selectedVehicle: {},

      // vehicleClass: [
      //   {
      //     vehicle_class: "1",
      //     description: "1-CAR/JEEP/VAN",
      //     selection_key: "F1",
      //     status: "True",
      //     allowed_speed: "100",
      //     date: "3/17/2021 12:00:00 AM",
      //   },
      // ],
      fields: [
        {
          columnName: "Class No.",
          columnLabel: "CLASS_NO",
          sortEnabled: true,
          columnWidth: 105,
        },
        {
          columnName: "Description",
          columnLabel: "description",
          sortEnabled: true,
          columnWidth: 175,
        },
        {
          columnName: "Selection Key",
          columnLabel: "selection_key",
          sortEnabled: true,
          columnWidth: 105,
        },
        {
          columnName: "Status",
          columnLabel: "status",
          sortEnabled: true,
          columnWidth: 175,
        },
        {
          columnName: "Date",
          columnLabel: "date",
          columnWidth: 175,
        },
        {
          columnName: "Action",
          columnLabel: "action",
          columnWidth: 105,
        },
      ],
    };
  },

  methods: {
    editVehicle(item) {
      this.selectedVehicle = item;
      window.$("#kt_modal_edit_vehicle").modal("show");
    },
    async getAllVehicle() {
      try {
        const res = await ApiService.get(
          `${API_ROUTES.TRANSACTION_VALIDATE.GET_ALL_VEHICLE_CLASS}`
        );
        this.allVehicle = res.data.data.vehicleClass;
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
    async deleteVehicle(item) {
      swal
        .fire({
          title: "Are you sure?",
          text: "",
          confirmButtonText: "Yes",
          denyButtonText: "No",
          showDenyButton: true,
          icon: "warning",
        })
        .then(async (result) => {
          if (result.isConfirmed) {
            try {
              await ApiService.delete(
                `${API_ROUTES.VEHICLE.DELETE_VEHICLE}${item}`
              );
              swal.fire({
                title: "Vehicle Class Is Deleted!",
                icon: "success",
                showCancelButton: false,
                showConfirmButton: false,
                timer: 1000,
              });
              await this.getAllVehicle();
            } catch (e) {
              swal.fire({
                title: e.response.data.message,
                icon: "error",
                showCancelButton: false,
                showConfirmButton: false,
                timer: 2000,
              });
            }
          }
        });
    },
  },
  async mounted() {
    await this.getAllVehicle();
  },
});
</script>
