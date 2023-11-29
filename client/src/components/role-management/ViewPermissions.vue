<template>
  <div class="modal fade" id="kt_modal_view_permission" ref="addDeviceModalRef" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header" id="kt_modal_add_company_header">
          <h2 class="fw-bold">Modules & Permissions</h2>
          <br />
          <div id="kt_modal_add_company_close" data-bs-dismiss="modal"
            class="btn btn-icon btn-sm btn-active-icon-primary">
            <KTIcon icon-name="cross" icon-class="fs-1" />
          </div>
        </div>

        <div v-if="rolePermissions.length > 0">
          <template v-for="(item, index) in rolePermissions" :key="index">
            <div class="row">
              <div class="mx-8 m-4 d-flex align-items-center">
                <KTIcon icon-name="abstract-26" :icon-class="`text-success fs-1 me-5`" />
                <div class="flex-grow-1 col-4">
                  <span class="text-gray-800 text-hover-primary fw-bold fs-6">{{ getModuleName(item.module_id) }}</span>
                </div>
                <div class="col-4">
                  <span class="text-success fw-bold fs-6 d-block">{{ getPermissionName(item.permission) }}
                  </span>
                </div>
              </div>
            </div>
          </template>
        </div>
        <div class="text-center" v-else>
          <p class="p-5">No modules & permissions given</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useMasterData } from "@/stores/common";

export default defineComponent({
  name: "view-permissions-modal",
  props: {
    rolePermissions: Object as any,
  },
  data() {
    return {
      masters: useMasterData() as any,
    }
  },
  computed: {
    modules() {
      return this.masters.getMasters.moduleMaster
    }
  },
  methods: {
    getModuleName(id) {
      const obj = this.modules.find(m => m.id === id)
      return obj ? obj.module_name : 'NA'
    },
    getPermissionName(permission) {
      return (permission === 'RW') ? 'Full Access' : 'Read Only'
    }
  }
});
</script>
