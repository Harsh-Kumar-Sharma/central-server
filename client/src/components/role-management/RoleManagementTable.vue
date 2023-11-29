<template>
  <div>
    <button type="button" class="btn btn-sm btn-primary align-items-end create" data-bs-toggle="modal"
      data-bs-target="#kt_modal_create_role" @click="getAllModules">
      <KTIcon icon-name="plus" icon-class="fs-2" />Create New Role
    </button>
  </div>
  <!--begin::Tables Widget 11-->
  <div :class="widgetClasses" class="card">
    <!--begin::Header-->
    <div class="card-header border-0 pt-5">
      <div class="card-title">
        <!--begin::Search-->
        <div class="d-flex align-items-center position-relative my-1"></div>
        <!--end::Search-->
      </div>
      <div class="d-flex justify-content-end float-end" data-kt-customer-table-toolbar="base">
        <!--begin::Add customer-->

        <!--end::Add customer-->
      </div>
    </div>
    <!--end::Header-->

    <!--begin::Body-->
    <div class="card-body py-1">
      <!--begin::Table container-->
      <div class="table-responsive">
        <!--begin::Table-->
        <table class="table align-middle gs-0 gy-4">
          <!--begin::Table head-->
          <thead>
            <tr class="fw-bold text-muted bg-light">
              <th class="ps-4 min-w-100px rounded-start">ID</th>
              <th class="min-w-150px">Role Name</th>
              <th class="min-w-150px">Created At</th>
              <th class="min-w-150px">Updated At</th>
              <th class="min-w-150px">Permission</th>
              <th class="min-w-20px">Action</th>
            </tr>
          </thead>
          <!--end::Table head-->

          <!--begin::Table body-->
          <tbody>
            <template v-for="role in roles" :key="role.id">
              <tr>
                <td>
                  <div class="d-flex align-items-center">
                    <div class="d-flex justify-content-start flex-column">
                      <a class="text-dark fw-bold text-hover-primary mb-1 fs-6 ms-4">
                        {{ role.id }}</a>
                    </div>
                  </div>
                </td>

                <td>
                  <a class="text-dark fw-bold text-hover-primary d-block mb-1 fs-6">{{ role.role_name }}</a>
                </td>
                <td>
                  <a class="text-dark fw-bold text-hover-primary d-block mb-1 fs-6">{{ new
                    Date(role.created_at).toDateString() }}</a>
                </td>
                <td>
                  <a class="text-dark fw-bold text-hover-primary d-block mb-1 fs-6">{{ new
                    Date(role.updated_at).toDateString() }}</a>
                </td>
                <td>
                  <a class="text-dark fw-bold text-hover-primary d-block mb-1 fs-7"><button type="button"
                      class="btn btn-sm btn-light-primary" data-bs-toggle="modal"
                      data-bs-target="#kt_modal_view_permission" @click="viewPermission(role.id)">
                      View Permissions
                    </button></a>
                </td>

                <td>
                  <a class="btn btn-sm btn-light btn-primary" data-kt-menu-trigger="click"
                    data-kt-menu-placement="bottom-end" data-kt-menu-flip="top-end" @click="editRole(role)">Edit
                  </a>
                </td>
              </tr>
            </template>
          </tbody>
          <!--end::Table body-->
        </table>
        <!--end::Table-->
      </div>
      <!--end::Table container-->
    </div>
    <!--begin::Body-->
  </div>
  <ViewDetailModal :permissionData="permission"></ViewDetailModal>
  <CreateRoleModal @submit="handleEmitValue" :moduleData="modules"></CreateRoleModal>
  <EditRoleModal :roleData="selectedRole" @submit="handleEditEmit"></EditRoleModal>
  <!--end::Tables Widget 11-->
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ViewDetailModal from "@/components/role-management/ViewPermissions.vue";
import CreateRoleModal from "@/components/role-management/CreateRoleModal.vue";
import { API_ROUTES, BASE_URL } from "@/constants/Config";
import axios from "axios";
import EditRoleModal from "@/components/role-management/EditRoleModal.vue";

export default defineComponent({
  name: "kt-widget-11",
  components: {
    ViewDetailModal,
    CreateRoleModal,
    EditRoleModal,
  },
  props: {
    widgetClasses: String,
  },

  data() {
    return {
      roles: [] as any,
      selectedRole: {},
      permission: {},
      modules: {},
    };
  },
  methods: {
    createRole() { },
    updateRole() { },
    editRole(role) {
      this.selectedRole = role;
      (window as any).$("#kt_modal_edit_role").modal("show");
    },
    async viewPermission(id) {
      const res = await axios.get(
        `${BASE_URL}${API_ROUTES.ROLES.GET_PERMISSION}${id}`
      );
      this.permission = res.data.data.permissions.modules;
    },

    async getAllModules() {
      const res = await axios.get(
        `${BASE_URL}${API_ROUTES.ROLES.GET_MODULES_SUBMODULES}`
      );
      this.modules = res.data.data.getModulesandSubmodules;
    },

    async handleEmitValue(value) {
      const payload = JSON.parse(value);
      // passing true value only
      const module_ids = Object.entries(payload.modules)
        .filter(([_, value]) => value === true)
        .map(([number, _]) => parseInt(number));

      // // {module_id:1},{module_id:2}
      const modules = [] as any;
      for (let i = 0; i < module_ids.length; i++) {
        modules.push({ module_id: module_ids[i] });
      }

      // submodules selection
      // const submodule_ids = Object.keys(payload.submodule);

      // const submodule = [];
      // for (let i = 0; i < submodule_ids.length; i++) {
      //   submodule.push({ sub_module_id: submodule_ids[i] });
      // }

      const requestData = {
        role_name: payload.role_name,
        modules: [modules],
      };

      const res = await axios.post(
        `${BASE_URL}${API_ROUTES.ROLES.CREATE_ROLE}`,
        requestData
      );
    },
    async handleEditEmit(body) {
      const payload = JSON.parse(body);

      await axios.patch(
        `${BASE_URL}${API_ROUTES.ROLES.UPDATE_ROLES}${payload.id}`,
        payload
      );
      (window as any).$("#kt_modal_edit_role").modal("hide");
    },
  },
  async mounted() {
    const res = await axios.get(`${BASE_URL}${API_ROUTES.ROLES.GET_ROLES}`);
    this.roles = res.data.data.allroles;
  },
});
</script>
<style scoped>
.create {
  position: absolute;
  top: 83px;
  right: 30px;
}
</style>
